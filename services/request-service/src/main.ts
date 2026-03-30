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

type VolunteerProfile = {
  id: string;
  userId: string;
  verificationStatus: "pending" | "approved" | "rejected";
};

type AssignmentRecord = {
  id: string;
  volunteerId?: string | null;
  status: "assigned" | "in_progress" | "completed";
};

type GeocodeRecord = {
  lat: string;
  lon: string;
};

const app = express();
const port = Number(process.env.PORT ?? 3002);
const jwtSecret = process.env.JWT_SECRET ?? "dev-super-secret";
const notificationServiceUrl = process.env.NOTIFICATION_SERVICE_URL ?? "http://localhost:3004";
const volunteerServiceUrl = process.env.VOLUNTEER_SERVICE_URL ?? "http://localhost:3003";
const geocoderBaseUrl = process.env.GEOCODER_BASE_URL ?? "https://nominatim.openstreetmap.org";
const geocoderUserAgent = process.env.GEOCODER_USER_AGENT ?? "relieflink-platform/1.0";
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const createSchema = z.object({
  category: z.nativeEnum(RequestCategory),
  description: z.string().min(5),
  urgency: z.nativeEnum(Urgency),
  district: z.string().min(2),
  city: z.string().min(2),
  addressLine: z.string().min(5),
  peopleCount: z.number().int().positive()
});

const updateSchema = z.object({
  category: z.nativeEnum(RequestCategory).optional(),
  description: z.string().min(5).optional(),
  urgency: z.nativeEnum(Urgency).optional(),
  district: z.string().min(2).optional(),
  city: z.string().min(2).optional(),
  addressLine: z.string().min(5).optional(),
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

const isPrivileged = (role?: Role): boolean => role === "admin" || role === "coordinator";

const canVolunteerTransition = (oldStatus: RequestStatus, newStatus: RequestStatus): boolean => {
  if (oldStatus === RequestStatus.assigned && newStatus === RequestStatus.in_progress) {
    return true;
  }

  if (oldStatus === RequestStatus.in_progress && newStatus === RequestStatus.completed) {
    return true;
  }

  return false;
};

const pause = async (ms: number): Promise<void> => {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const geocodeAddress = async (
  addressLine: string,
  city: string,
  district: string
): Promise<{ latitude: number; longitude: number } | null> => {
  const query = `${addressLine}, ${city}, ${district}, Sri Lanka`;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const url = new URL("/search", geocoderBaseUrl);
      url.searchParams.set("format", "json");
      url.searchParams.set("limit", "1");
      url.searchParams.set("q", query);

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": geocoderUserAgent
        }
      });

      if (response.status === 429) {
        await pause(500 * attempt);
        continue;
      }

      if (!response.ok) {
        continue;
      }

      const payload = (await response.json()) as GeocodeRecord[];
      if (!payload.length) {
        return null;
      }

      const first = payload[0];
      const latitude = Number(first.lat);
      const longitude = Number(first.lon);

      if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        return null;
      }

      return { latitude, longitude };
    } catch {
      await pause(300 * attempt);
    }
  }

  return null;
};

const notify = async (payload: {
  userId: string;
  message: string;
  requestId?: string;
  oldStatus?: string;
  newStatus?: string;
  changedBy?: string;
}): Promise<void> => {
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

const fetchVolunteerProfile = async (authHeader?: string): Promise<VolunteerProfile | null> => {
  if (!authHeader) {
    return null;
  }

  try {
    const response = await fetch(`${volunteerServiceUrl}/api/v1/volunteers/me`, {
      headers: { Authorization: authHeader }
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as VolunteerProfile;
  } catch {
    return null;
  }
};

const fetchAssignmentsForRequest = async (
  requestId: string,
  authHeader?: string
): Promise<AssignmentRecord[]> => {
  if (!authHeader) {
    return [];
  }

  try {
    const response = await fetch(`${volunteerServiceUrl}/api/v1/assignments/${requestId}`, {
      headers: { Authorization: authHeader }
    });

    if (!response.ok) {
      return [];
    }

    return (await response.json()) as AssignmentRecord[];
  } catch {
    return [];
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

  const geocode = await geocodeAddress(parsed.data.addressLine, parsed.data.city, parsed.data.district);

  const record = await prisma.reliefRequest.create({
    data: {
      requesterId: req.user.userId,
      category: parsed.data.category,
      description: parsed.data.description,
      urgency: parsed.data.urgency,
      district: parsed.data.district,
      city: parsed.data.city,
      addressLine: parsed.data.addressLine,
      latitude: geocode?.latitude,
      longitude: geocode?.longitude,
      peopleCount: parsed.data.peopleCount,
      status: RequestStatus.pending,
      lastStatusUpdatedBy: req.user.userId
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

  prisma.reliefRequest
    .findMany({
      where: {
        ...(status ? { status: String(status) as RequestStatus } : {}),
        ...(urgency ? { urgency: String(urgency) as Urgency } : {}),
        ...(district ? { district: { equals: String(district), mode: "insensitive" } } : {}),
        ...(category ? { category: String(category) as RequestCategory } : {})
      },
      orderBy: { createdAt: "desc" }
    })
    .then((rows) => res.json(rows));
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

  let latitude = existing.latitude;
  let longitude = existing.longitude;

  const effectiveAddressLine = parsed.data.addressLine ?? existing.addressLine;
  const effectiveCity = parsed.data.city ?? existing.city;
  const effectiveDistrict = parsed.data.district ?? existing.district;

  if (
    parsed.data.addressLine !== undefined ||
    parsed.data.city !== undefined ||
    parsed.data.district !== undefined
  ) {
    const geocode = await geocodeAddress(effectiveAddressLine, effectiveCity, effectiveDistrict);
    latitude = geocode?.latitude ?? existing.latitude;
    longitude = geocode?.longitude ?? existing.longitude;
  }

  const item = await prisma.reliefRequest.update({
    where: { id: req.params.id },
    data: {
      ...parsed.data,
      latitude,
      longitude
    }
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

  const actor = req.user;
  if (!isPrivileged(actor?.role)) {
    if (!actor || actor.role !== "volunteer") {
      res.status(403).json({ message: "Only admin users or assigned volunteers can update this status" });
      return;
    }

    if (!canVolunteerTransition(item.status, parsed.data.status)) {
      res.status(403).json({ message: "Volunteers can only move assigned -> in_progress and in_progress -> completed" });
      return;
    }

    const volunteerProfile = await fetchVolunteerProfile(req.headers.authorization);
    if (!volunteerProfile || volunteerProfile.verificationStatus !== "approved") {
      res.status(403).json({ message: "Only approved volunteer profiles can update mission progress" });
      return;
    }

    const assignments = await fetchAssignmentsForRequest(req.params.id, req.headers.authorization);
    const isAssignedVolunteer = assignments.some(
      (assignment) =>
        assignment.volunteerId === volunteerProfile.id &&
        ["assigned", "in_progress"].includes(assignment.status)
    );

    if (!isAssignedVolunteer) {
      res.status(403).json({ message: "Volunteer is not assigned to this mission" });
      return;
    }
  }

  const oldStatus = item.status;
  const changedBy = actor?.userId ?? "system";

  const updated = await prisma.reliefRequest.update({
    where: { id: req.params.id },
    data: {
      status: parsed.data.status,
      lastStatusUpdatedBy: changedBy
    }
  });

  await notify({
    userId: item.requesterId,
    message: `Request ${item.id} status changed from ${oldStatus} to ${updated.status}`,
    requestId: item.id,
    oldStatus: String(oldStatus),
    newStatus: String(updated.status),
    changedBy
  });

  res.json(updated);
});

app.listen(port, () => {
  console.log(`Request service running on http://localhost:${port}`);
});
