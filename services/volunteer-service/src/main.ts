import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  AssignmentStatus,
  MissionApplicationStatus,
  PrismaClient,
  ResourceAvailability,
  VolunteerAvailability,
  VolunteerVerificationStatus
} from "@prisma/client";
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

type RealtimeEventType =
  | "volunteer:verification-updated"
  | "mission:application-updated"
  | "mission:assignment-updated";

const app = express();
const port = Number(process.env.PORT ?? 3003);
const jwtSecret = process.env.JWT_SECRET ?? "dev-super-secret";
const requestServiceUrl = process.env.REQUEST_SERVICE_URL ?? "http://localhost:3002";
const notificationServiceUrl = process.env.NOTIFICATION_SERVICE_URL ?? "http://localhost:3004";
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const volunteerSchema = z.object({
  userId: z.string().min(1),
  skillSet: z.array(z.string()).default([]),
  district: z.string().min(2),
  city: z.string().min(2),
  availabilityStatus: z.nativeEnum(VolunteerAvailability).default(VolunteerAvailability.available)
});

const availabilitySchema = z.object({
  availabilityStatus: z.nativeEnum(VolunteerAvailability)
});

const verificationSchema = z.object({
  verificationStatus: z.nativeEnum(VolunteerVerificationStatus),
  verificationNotes: z.string().max(500).optional()
});

const resourceSchema = z.object({
  ownerId: z.string().min(1),
  category: z.string().min(2),
  quantity: z.number().int().positive(),
  district: z.string().min(2),
  city: z.string().min(2),
  availabilityStatus: z.nativeEnum(ResourceAvailability).default(ResourceAvailability.available)
});

const applicationCreateSchema = z.object({
  message: z.string().max(500).optional()
});

const applicationStatusSchema = z.object({
  status: z.enum(["accepted", "rejected"])
});

const assignmentSchema = z.object({
  requestId: z.string().min(1),
  volunteerId: z.string().optional(),
  resourceId: z.string().optional(),
  applicationId: z.string().optional(),
  status: z.nativeEnum(AssignmentStatus).default(AssignmentStatus.assigned)
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

const requireAdminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ message: "Admin access required" });
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

const emitRealtime = async (
  eventType: RealtimeEventType,
  payload: Record<string, unknown>,
  options: { userId?: string; requestId?: string } = {}
): Promise<void> => {
  try {
    await fetch(`${notificationServiceUrl}/api/v1/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType,
        userId: options.userId,
        requestId: options.requestId,
        payload
      })
    });
  } catch (error) {
    console.error("Failed to emit realtime event", error);
  }
};

const ensureRequestExists = async (requestId: string, authHeader?: string): Promise<boolean> => {
  try {
    const response = await fetch(`${requestServiceUrl}/api/v1/requests/${requestId}`, {
      headers: {
        Authorization: authHeader ?? ""
      }
    });

    return response.ok;
  } catch {
    return false;
  }
};

app.get("/health", (_req, res) => {
  res.json({ service: "volunteer-service", status: "ok" });
});

app.post("/api/v1/volunteers", authMiddleware, async (req: AuthRequest, res) => {
  const parsed = volunteerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.flatten() });
    return;
  }

  if (req.user?.userId !== parsed.data.userId && !["coordinator", "admin"].includes(req.user?.role ?? "")) {
    res.status(403).json({ message: "Cannot register for another user" });
    return;
  }

  const existing = await prisma.volunteer.findUnique({ where: { userId: parsed.data.userId } });
  if (existing) {
    res.status(409).json({ message: "Volunteer profile already exists" });
    return;
  }

  const record = await prisma.volunteer.create({
    data: {
      ...parsed.data,
      verificationStatus: VolunteerVerificationStatus.pending
    }
  });

  await callNotification(parsed.data.userId, "Volunteer profile submitted and pending super admin approval");
  await emitRealtime(
    "volunteer:verification-updated",
    {
      volunteerId: record.id,
      verificationStatus: record.verificationStatus
    },
    { userId: record.userId }
  );

  res.status(201).json(record);
});

app.get("/api/v1/volunteers/me", authMiddleware, async (req: AuthRequest, res) => {
  const currentUserId = req.user?.userId;
  if (!currentUserId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const current = await prisma.volunteer.findUnique({ where: { userId: currentUserId } });
  if (!current) {
    res.status(404).json({ message: "Volunteer profile not found" });
    return;
  }

  res.json(current);
});

app.get("/api/v1/volunteers", authMiddleware, async (req, res) => {
  const verificationStatus = typeof req.query.verificationStatus === "string" ? req.query.verificationStatus : undefined;

  if (
    verificationStatus !== undefined &&
    !Object.values(VolunteerVerificationStatus).includes(verificationStatus as VolunteerVerificationStatus)
  ) {
    res.status(400).json({ message: "Invalid verificationStatus filter" });
    return;
  }

  const volunteers = await prisma.volunteer.findMany({
    where: {
      ...(verificationStatus ? { verificationStatus: verificationStatus as VolunteerVerificationStatus } : {})
    },
    orderBy: { createdAt: "desc" }
  });
  res.json(volunteers);
});

app.patch("/api/v1/volunteers/:id/availability", authMiddleware, async (req: AuthRequest, res) => {
  const parsed = availabilitySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.flatten() });
    return;
  }

  const volunteer = await prisma.volunteer.findUnique({ where: { id: req.params.id } });
  if (!volunteer) {
    res.status(404).json({ message: "Volunteer not found" });
    return;
  }

  if (volunteer.userId !== req.user?.userId && !["coordinator", "admin"].includes(req.user?.role ?? "")) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const updated = await prisma.volunteer.update({
    where: { id: req.params.id },
    data: { availabilityStatus: parsed.data.availabilityStatus }
  });

  res.json(updated);
});

app.patch(
  "/api/v1/volunteers/:id/verification",
  authMiddleware,
  requireAdminOnly,
  async (req: AuthRequest, res) => {
    const parsed = verificationSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.flatten() });
      return;
    }

    const volunteer = await prisma.volunteer.findUnique({ where: { id: req.params.id } });
    if (!volunteer) {
      res.status(404).json({ message: "Volunteer not found" });
      return;
    }

    const updated = await prisma.volunteer.update({
      where: { id: req.params.id },
      data: {
        verificationStatus: parsed.data.verificationStatus,
        verificationNotes: parsed.data.verificationNotes,
        verifiedBy: req.user?.userId,
        verifiedAt: new Date()
      }
    });

    const humanStatus = updated.verificationStatus === "approved" ? "approved" : "rejected";
    await callNotification(updated.userId, `Your volunteer profile was ${humanStatus} by super admin`);

    await emitRealtime(
      "volunteer:verification-updated",
      {
        volunteerId: updated.id,
        verificationStatus: updated.verificationStatus,
        verificationNotes: updated.verificationNotes ?? null
      },
      { userId: updated.userId }
    );

    res.json(updated);
  }
);

app.post("/api/v1/resources", authMiddleware, async (req: AuthRequest, res) => {
  const parsed = resourceSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.flatten() });
    return;
  }

  const record = await prisma.resource.create({ data: parsed.data });
  res.status(201).json(record);
});

app.get("/api/v1/resources", authMiddleware, async (req, res) => {
  const { district, category } = req.query;

  const filtered = await prisma.resource.findMany({
    where: {
      ...(district ? { district: { equals: String(district), mode: "insensitive" } } : {}),
      ...(category ? { category: { equals: String(category), mode: "insensitive" } } : {})
    },
    orderBy: { createdAt: "desc" }
  });

  res.json(filtered);
});

app.post("/api/v1/missions/:requestId/applications", authMiddleware, async (req: AuthRequest, res) => {
  const actor = req.user;
  if (!actor || actor.role !== "volunteer") {
    res.status(403).json({ message: "Only volunteers can apply for missions" });
    return;
  }

  const parsed = applicationCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.flatten() });
    return;
  }

  const volunteer = await prisma.volunteer.findUnique({ where: { userId: actor.userId } });
  if (!volunteer) {
    res.status(404).json({ message: "Volunteer profile not found" });
    return;
  }

  if (volunteer.verificationStatus !== VolunteerVerificationStatus.approved) {
    res.status(403).json({ message: "Volunteer must be approved before applying to missions" });
    return;
  }

  const requestExists = await ensureRequestExists(req.params.requestId, req.headers.authorization);
  if (!requestExists) {
    res.status(404).json({ message: "Mission request not found" });
    return;
  }

  try {
    const application = await prisma.missionApplication.create({
      data: {
        requestId: req.params.requestId,
        volunteerId: volunteer.id,
        message: parsed.data.message,
        status: MissionApplicationStatus.pending
      }
    });

    await callNotification(actor.userId, `Your application for mission ${req.params.requestId} was submitted`);
    await emitRealtime(
      "mission:application-updated",
      {
        applicationId: application.id,
        requestId: application.requestId,
        volunteerId: application.volunteerId,
        status: application.status
      },
      { requestId: application.requestId, userId: actor.userId }
    );

    res.status(201).json(application);
  } catch {
    res.status(409).json({ message: "Application already exists for this mission and volunteer" });
  }
});

app.get("/api/v1/missions/:requestId/applications", authMiddleware, requireCoordinatorOrAdmin, async (req, res) => {
  const records = await prisma.missionApplication.findMany({
    where: { requestId: req.params.requestId },
    include: {
      volunteer: true
    },
    orderBy: { createdAt: "desc" }
  });

  res.json(records);
});

app.get("/api/v1/applications", authMiddleware, requireCoordinatorOrAdmin, async (req, res) => {
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const requestId = typeof req.query.requestId === "string" ? req.query.requestId : undefined;

  if (status && !Object.values(MissionApplicationStatus).includes(status as MissionApplicationStatus)) {
    res.status(400).json({ message: "Invalid status" });
    return;
  }

  const records = await prisma.missionApplication.findMany({
    where: {
      ...(status ? { status: status as MissionApplicationStatus } : {}),
      ...(requestId ? { requestId } : {})
    },
    include: {
      volunteer: true
    },
    orderBy: { createdAt: "desc" }
  });

  res.json(records);
});

app.get("/api/v1/applications/mine", authMiddleware, async (req: AuthRequest, res) => {
  const currentUserId = req.user?.userId;
  if (!currentUserId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const volunteer = await prisma.volunteer.findUnique({ where: { userId: currentUserId } });
  if (!volunteer) {
    res.status(404).json({ message: "Volunteer profile not found" });
    return;
  }

  const records = await prisma.missionApplication.findMany({
    where: { volunteerId: volunteer.id },
    orderBy: { createdAt: "desc" }
  });

  res.json(records);
});

app.patch("/api/v1/applications/:id/status", authMiddleware, requireAdminOnly, async (req: AuthRequest, res) => {
  const parsed = applicationStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.flatten() });
    return;
  }

  const application = await prisma.missionApplication.findUnique({
    where: { id: req.params.id },
    include: {
      volunteer: true
    }
  });

  if (!application) {
    res.status(404).json({ message: "Application not found" });
    return;
  }

  const updated = await prisma.missionApplication.update({
    where: { id: req.params.id },
    data: { status: parsed.data.status as MissionApplicationStatus }
  });

  await callNotification(
    application.volunteer.userId,
    `Your mission application for request ${application.requestId} is now ${updated.status}`
  );

  await emitRealtime(
    "mission:application-updated",
    {
      applicationId: updated.id,
      requestId: updated.requestId,
      volunteerId: updated.volunteerId,
      status: updated.status
    },
    { requestId: updated.requestId, userId: application.volunteer.userId }
  );

  res.json(updated);
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

  let volunteerId = parsed.data.volunteerId;
  let applicationUserId: string | null = null;

  if (parsed.data.applicationId) {
    const application = await prisma.missionApplication.findUnique({
      where: { id: parsed.data.applicationId },
      include: {
        volunteer: true
      }
    });

    if (!application) {
      res.status(404).json({ message: "Application not found" });
      return;
    }

    if (application.requestId !== parsed.data.requestId) {
      res.status(400).json({ message: "Application does not belong to the provided request" });
      return;
    }

    if (application.status !== MissionApplicationStatus.accepted) {
      res.status(400).json({ message: "Application must be accepted before assignment" });
      return;
    }

    volunteerId = volunteerId ?? application.volunteerId;
    applicationUserId = application.volunteer.userId;

    if (volunteerId !== application.volunteerId) {
      res.status(400).json({ message: "Assignment volunteerId does not match accepted application" });
      return;
    }
  }

  if (volunteerId) {
    const volunteer = await prisma.volunteer.findUnique({ where: { id: volunteerId } });
    if (!volunteer) {
      res.status(404).json({ message: "Volunteer not found" });
      return;
    }

    if (volunteer.verificationStatus !== VolunteerVerificationStatus.approved) {
      res.status(400).json({ message: "Volunteer must be approved before assignment" });
      return;
    }

    applicationUserId = volunteer.userId;
  }

  if (parsed.data.resourceId && !(await prisma.resource.findUnique({ where: { id: parsed.data.resourceId } }))) {
    res.status(404).json({ message: "Resource not found" });
    return;
  }

  const assignment = await prisma.assignment.create({
    data: {
      requestId: parsed.data.requestId,
      volunteerId,
      resourceId: parsed.data.resourceId,
      applicationId: parsed.data.applicationId,
      assignedBy: req.user?.userId ?? "system",
      status: parsed.data.status
    }
  });

  await fetch(`${requestServiceUrl}/api/v1/requests/${parsed.data.requestId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization ?? ""
    },
    body: JSON.stringify({ status: "assigned" })
  });

  if (applicationUserId) {
    await callNotification(applicationUserId, `You were assigned to request ${parsed.data.requestId}`);
  }

  await emitRealtime(
    "mission:assignment-updated",
    {
      assignmentId: assignment.id,
      requestId: assignment.requestId,
      volunteerId: assignment.volunteerId,
      resourceId: assignment.resourceId,
      status: assignment.status
    },
    { requestId: assignment.requestId, userId: applicationUserId ?? undefined }
  );

  res.status(201).json(assignment);
});

app.get("/api/v1/assignments/mine", authMiddleware, async (req: AuthRequest, res) => {
  const currentUserId = req.user?.userId;
  if (!currentUserId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const volunteer = await prisma.volunteer.findUnique({ where: { userId: currentUserId } });
  if (!volunteer) {
    res.status(404).json({ message: "Volunteer profile not found" });
    return;
  }

  const records = await prisma.assignment.findMany({
    where: { volunteerId: volunteer.id },
    orderBy: { assignedAt: "desc" }
  });

  res.json(records);
});

app.get("/api/v1/assignments/:requestId", authMiddleware, async (req, res) => {
  const records = await prisma.assignment.findMany({
    where: { requestId: req.params.requestId },
    orderBy: { assignedAt: "desc" }
  });
  res.json(records);
});

app.listen(port, () => {
  console.log(`Volunteer service running on http://localhost:${port}`);
});
