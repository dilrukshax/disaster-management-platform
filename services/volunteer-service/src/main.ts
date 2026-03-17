import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

dotenv.config({ path: "../../.env" });

type Role = "requester" | "volunteer" | "coordinator" | "admin";

type Volunteer = {
  id: string;
  userId: string;
  skillSet: string[];
  district: string;
  city: string;
  availabilityStatus: "available" | "busy" | "offline";
  createdAt: string;
  updatedAt: string;
};

type Resource = {
  id: string;
  ownerId: string;
  category: string;
  quantity: number;
  district: string;
  city: string;
  availabilityStatus: "available" | "reserved" | "unavailable";
  createdAt: string;
  updatedAt: string;
};

type Assignment = {
  id: string;
  requestId: string;
  volunteerId?: string;
  resourceId?: string;
  assignedBy: string;
  status: "assigned" | "in_progress" | "completed";
  assignedAt: string;
};

type AuthRequest = Request & {
  user?: {
    userId: string;
    email: string;
    role: Role;
  };
};

const app = express();
const port = Number(process.env.PORT ?? 3003);
const jwtSecret = process.env.JWT_SECRET ?? "dev-super-secret";
const requestServiceUrl = process.env.REQUEST_SERVICE_URL ?? "http://localhost:3002";
const notificationServiceUrl = process.env.NOTIFICATION_SERVICE_URL ?? "http://localhost:3004";

app.use(cors());
app.use(express.json());

const volunteers: Volunteer[] = [];
const resources: Resource[] = [];
const assignments: Assignment[] = [];

const volunteerSchema = z.object({
  userId: z.string().min(1),
  skillSet: z.array(z.string()).default([]),
  district: z.string().min(2),
  city: z.string().min(2),
  availabilityStatus: z.enum(["available", "busy", "offline"]).default("available")
});

const availabilitySchema = z.object({
  availabilityStatus: z.enum(["available", "busy", "offline"])
});

const resourceSchema = z.object({
  ownerId: z.string().min(1),
  category: z.string().min(2),
  quantity: z.number().int().positive(),
  district: z.string().min(2),
  city: z.string().min(2),
  availabilityStatus: z.enum(["available", "reserved", "unavailable"]).default("available")
});

const assignmentSchema = z.object({
  requestId: z.string().min(1),
  volunteerId: z.string().optional(),
  resourceId: z.string().optional(),
  status: z.enum(["assigned", "in_progress", "completed"]).default("assigned")
});

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing bearer token" });
    return;
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    req.user = jwt.verify(token, jwtSecret) as AuthRequest["user"];
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

const requireCoordinatorOrAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || !["coordinator", "admin"].includes(req.user.role)) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  next();
};

const callNotification = async (userId: string, message: string): Promise<void> => {
  try {
    await fetch(`${notificationServiceUrl}/api/v1/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, message, channel: "in_app" })
    });
  } catch (error) {
    console.error("Failed to call notification service", error);
  }
};

app.get("/health", (_req, res) => {
  res.json({ service: "volunteer-service", status: "ok" });
});

app.post("/api/v1/volunteers", authMiddleware, (req: AuthRequest, res) => {
  const parsed = volunteerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.flatten() });
    return;
  }

  if (req.user?.userId !== parsed.data.userId && !["coordinator", "admin"].includes(req.user?.role ?? "")) {
    res.status(403).json({ message: "Cannot register for another user" });
    return;
  }

  const record: Volunteer = {
    id: uuidv4(),
    userId: parsed.data.userId,
    skillSet: parsed.data.skillSet,
    district: parsed.data.district,
    city: parsed.data.city,
    availabilityStatus: parsed.data.availabilityStatus,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  volunteers.push(record);
  res.status(201).json(record);
});

app.get("/api/v1/volunteers", authMiddleware, (_req, res) => {
  res.json(volunteers);
});

app.patch("/api/v1/volunteers/:id/availability", authMiddleware, (req: AuthRequest, res) => {
  const parsed = availabilitySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.flatten() });
    return;
  }

  const volunteer = volunteers.find((v) => v.id === req.params.id);
  if (!volunteer) {
    res.status(404).json({ message: "Volunteer not found" });
    return;
  }

  if (volunteer.userId !== req.user?.userId && !["coordinator", "admin"].includes(req.user?.role ?? "")) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  volunteer.availabilityStatus = parsed.data.availabilityStatus;
  volunteer.updatedAt = new Date().toISOString();

  res.json(volunteer);
});

app.post("/api/v1/resources", authMiddleware, (req: AuthRequest, res) => {
  const parsed = resourceSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.flatten() });
    return;
  }

  const record: Resource = {
    id: uuidv4(),
    ownerId: parsed.data.ownerId,
    category: parsed.data.category,
    quantity: parsed.data.quantity,
    district: parsed.data.district,
    city: parsed.data.city,
    availabilityStatus: parsed.data.availabilityStatus,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  resources.push(record);
  res.status(201).json(record);
});

app.get("/api/v1/resources", authMiddleware, (req, res) => {
  const { district, category } = req.query;

  const filtered = resources.filter((item) => {
    const districtMatch = district ? item.district.toLowerCase() === String(district).toLowerCase() : true;
    const categoryMatch = category ? item.category.toLowerCase() === String(category).toLowerCase() : true;
    return districtMatch && categoryMatch;
  });

  res.json(filtered);
});

app.post("/api/v1/assignments", authMiddleware, requireCoordinatorOrAdmin, async (req: AuthRequest, res) => {
  const parsed = assignmentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.flatten() });
    return;
  }

  const requestResponse = await fetch(`${requestServiceUrl}/api/v1/requests/${parsed.data.requestId}`, {
    headers: { Authorization: req.headers.authorization ?? "" }
  });

  if (!requestResponse.ok) {
    res.status(400).json({ message: "Referenced request does not exist or is inaccessible" });
    return;
  }

  if (parsed.data.volunteerId && !volunteers.find((v) => v.id === parsed.data.volunteerId)) {
    res.status(404).json({ message: "Volunteer not found" });
    return;
  }

  if (parsed.data.resourceId && !resources.find((r) => r.id === parsed.data.resourceId)) {
    res.status(404).json({ message: "Resource not found" });
    return;
  }

  const assignment: Assignment = {
    id: uuidv4(),
    requestId: parsed.data.requestId,
    volunteerId: parsed.data.volunteerId,
    resourceId: parsed.data.resourceId,
    assignedBy: req.user?.userId ?? "system",
    status: parsed.data.status,
    assignedAt: new Date().toISOString()
  };

  assignments.push(assignment);

  await fetch(`${requestServiceUrl}/api/v1/requests/${parsed.data.requestId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization ?? ""
    },
    body: JSON.stringify({ status: "assigned" })
  });

  if (parsed.data.volunteerId) {
    const volunteer = volunteers.find((v) => v.id === parsed.data.volunteerId);
    if (volunteer) {
      await callNotification(volunteer.userId, `You were assigned to request ${parsed.data.requestId}`);
    }
  }

  res.status(201).json(assignment);
});

app.get("/api/v1/assignments/:requestId", authMiddleware, (req, res) => {
  const records = assignments.filter((a) => a.requestId === req.params.requestId);
  res.json(records);
});

app.listen(port, () => {
  console.log(`Volunteer service running on http://localhost:${port}`);
});
