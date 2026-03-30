import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient, RequestCategory, RequestStatus, Urgency } from "@prisma/client";
import { z } from "zod";

dotenv.config({ path: "../../.env" });

type Role = "requester" | "volunteer" | "coordinator" | "admin";

type AuthRequest = Request & {
  user?: {
    userId: string;
    email: string;
    role: Role;
  };
};

const app = express();
const port = Number(process.env.PORT ?? 3002);
const jwtSecret = process.env.JWT_SECRET ?? "dev-super-secret";
const notificationServiceUrl = process.env.NOTIFICATION_SERVICE_URL ?? "http://localhost:3004";
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const createSchema = z.object({
  category: z.nativeEnum(RequestCategory),
  description: z.string().min(5),
  urgency: z.nativeEnum(Urgency),
  district: z.string().min(2),
  city: z.string().min(2),
  peopleCount: z.number().int().positive()
});

const updateSchema = z.object({
  category: z.nativeEnum(RequestCategory).optional(),
  description: z.string().min(5).optional(),
  urgency: z.nativeEnum(Urgency).optional(),
  district: z.string().min(2).optional(),
  city: z.string().min(2).optional(),
  peopleCount: z.number().int().positive().optional()
});

const statusSchema = z.object({
  status: z.nativeEnum(RequestStatus)
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

const notify = async (payload: { userId: string; message: string; requestId?: string; oldStatus?: string; newStatus?: string; changedBy?: string; }): Promise<void> => {
  try {
    await fetch(`${notificationServiceUrl}/api/v1/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: payload.userId, message: payload.message, channel: "in_app" })
    });

    if (payload.requestId && payload.oldStatus && payload.newStatus && payload.changedBy) {
      await fetch(`${notificationServiceUrl}/api/v1/status-events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: payload.requestId,
          oldStatus: payload.oldStatus,
          newStatus: payload.newStatus,
          changedBy: payload.changedBy
        })
      });
    }
  } catch (error) {
    console.error("Notification service not reachable", error);
  }
};

app.get("/health", (_req, res) => {
  res.json({ service: "request-service", status: "ok" });
});

app.post("/api/v1/requests", authMiddleware, async (req: AuthRequest, res) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.flatten() });
    return;
  }

  const record = await prisma.reliefRequest.create({
    data: {
      requesterId: req.user.userId,
      category: parsed.data.category,
      description: parsed.data.description,
      urgency: parsed.data.urgency,
      district: parsed.data.district,
      city: parsed.data.city,
      peopleCount: parsed.data.peopleCount,
      status: RequestStatus.pending
    }
  });

  await notify({
    userId: req.user.userId,
    message: `Relief request created with status ${record.status}`,
    requestId: record.id,
    oldStatus: "created",
    newStatus: record.status,
    changedBy: req.user.userId
  });

  res.status(201).json(record);
});

app.get("/api/v1/requests", authMiddleware, (req, res) => {
  const { status, urgency, district, category } = req.query;

  prisma.reliefRequest.findMany({
    where: {
      ...(status ? { status: String(status) as RequestStatus } : {}),
      ...(urgency ? { urgency: String(urgency) as Urgency } : {}),
      ...(district ? { district: { equals: String(district), mode: "insensitive" } } : {}),
      ...(category ? { category: String(category) as RequestCategory } : {})
    },
    orderBy: { createdAt: "desc" }
  }).then((rows) => res.json(rows));
});

app.get("/api/v1/requests/:id", authMiddleware, async (req, res) => {
  const item = await prisma.reliefRequest.findUnique({ where: { id: req.params.id } });
  if (!item) {
    res.status(404).json({ message: "Request not found" });
    return;
  }

  res.json(item);
});

app.patch("/api/v1/requests/:id", authMiddleware, async (req: AuthRequest, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.flatten() });
    return;
  }

  const existing = await prisma.reliefRequest.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    res.status(404).json({ message: "Request not found" });
    return;
  }

  const item = await prisma.reliefRequest.update({
    where: { id: req.params.id },
    data: parsed.data
  });

  res.json(item);
});

app.patch("/api/v1/requests/:id/status", authMiddleware, async (req: AuthRequest, res) => {
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.flatten() });
    return;
  }

  const item = await prisma.reliefRequest.findUnique({ where: { id: req.params.id } });
  if (!item) {
    res.status(404).json({ message: "Request not found" });
    return;
  }

  const oldStatus = item.status;
  const updated = await prisma.reliefRequest.update({
    where: { id: req.params.id },
    data: { status: parsed.data.status }
  });

  await notify({
    userId: item.requesterId,
    message: `Request ${item.id} status changed from ${oldStatus} to ${updated.status}`,
    requestId: item.id,
    oldStatus: String(oldStatus),
    newStatus: String(updated.status),
    changedBy: req.user?.userId ?? "system"
  });

  res.json(updated);
});

app.listen(port, () => {
  console.log(`Request service running on http://localhost:${port}`);
});
