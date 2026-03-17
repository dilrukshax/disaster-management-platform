import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import { AssignmentStatus, PrismaClient, ResourceAvailability, VolunteerAvailability } from "../generated/client/index.js";
import { z } from "zod";
dotenv.config({ path: "../../.env" });
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
const resourceSchema = z.object({
    ownerId: z.string().min(1),
    category: z.string().min(2),
    quantity: z.number().int().positive(),
    district: z.string().min(2),
    city: z.string().min(2),
    availabilityStatus: z.nativeEnum(ResourceAvailability).default(ResourceAvailability.available)
});
const assignmentSchema = z.object({
    requestId: z.string().min(1),
    volunteerId: z.string().optional(),
    resourceId: z.string().optional(),
    status: z.nativeEnum(AssignmentStatus).default(AssignmentStatus.assigned)
});
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ message: "Missing bearer token" });
        return;
    }
    const token = authHeader.replace("Bearer ", "");
    try {
        req.user = jwt.verify(token, jwtSecret);
        next();
    }
    catch {
        res.status(401).json({ message: "Invalid token" });
    }
};
const requireCoordinatorOrAdmin = (req, res, next) => {
    if (!req.user || !["coordinator", "admin"].includes(req.user.role)) {
        res.status(403).json({ message: "Forbidden" });
        return;
    }
    next();
};
const callNotification = async (userId, message) => {
    try {
        await fetch(`${notificationServiceUrl}/api/v1/notifications`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, message, channel: "in_app" })
        });
    }
    catch (error) {
        console.error("Failed to call notification service", error);
    }
};
app.get("/health", (_req, res) => {
    res.json({ service: "volunteer-service", status: "ok" });
});
app.post("/api/v1/volunteers", authMiddleware, async (req, res) => {
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
    const record = await prisma.volunteer.create({ data: parsed.data });
    res.status(201).json(record);
});
app.get("/api/v1/volunteers", authMiddleware, async (_req, res) => {
    const volunteers = await prisma.volunteer.findMany({ orderBy: { createdAt: "desc" } });
    res.json(volunteers);
});
app.patch("/api/v1/volunteers/:id/availability", authMiddleware, async (req, res) => {
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
app.post("/api/v1/resources", authMiddleware, async (req, res) => {
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
app.post("/api/v1/assignments", authMiddleware, requireCoordinatorOrAdmin, async (req, res) => {
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
    if (parsed.data.volunteerId && !(await prisma.volunteer.findUnique({ where: { id: parsed.data.volunteerId } }))) {
        res.status(404).json({ message: "Volunteer not found" });
        return;
    }
    if (parsed.data.resourceId && !(await prisma.resource.findUnique({ where: { id: parsed.data.resourceId } }))) {
        res.status(404).json({ message: "Resource not found" });
        return;
    }
    const assignment = await prisma.assignment.create({
        data: {
            requestId: parsed.data.requestId,
            volunteerId: parsed.data.volunteerId,
            resourceId: parsed.data.resourceId,
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
    if (parsed.data.volunteerId) {
        const volunteer = await prisma.volunteer.findUnique({ where: { id: parsed.data.volunteerId } });
        if (volunteer) {
            await callNotification(volunteer.userId, `You were assigned to request ${parsed.data.requestId}`);
        }
    }
    res.status(201).json(assignment);
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
