import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
dotenv.config({ path: "../../.env" });
const app = express();
const port = Number(process.env.PORT ?? 3002);
const jwtSecret = process.env.JWT_SECRET ?? "dev-super-secret";
const notificationServiceUrl = process.env.NOTIFICATION_SERVICE_URL ?? "http://localhost:3004";
app.use(cors());
app.use(express.json());
const requests = [];
const createSchema = z.object({
    category: z.enum(["water", "food", "medicine", "shelter", "rescue", "transport", "other"]),
    description: z.string().min(5),
    urgency: z.enum(["low", "medium", "high"]),
    district: z.string().min(2),
    city: z.string().min(2),
    peopleCount: z.number().int().positive()
});
const updateSchema = z.object({
    category: z.enum(["water", "food", "medicine", "shelter", "rescue", "transport", "other"]).optional(),
    description: z.string().min(5).optional(),
    urgency: z.enum(["low", "medium", "high"]).optional(),
    district: z.string().min(2).optional(),
    city: z.string().min(2).optional(),
    peopleCount: z.number().int().positive().optional()
});
const statusSchema = z.object({
    status: z.enum(["pending", "matched", "assigned", "in_progress", "completed", "cancelled"])
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
const notify = async (payload) => {
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
    }
    catch (error) {
        console.error("Notification service not reachable", error);
    }
};
app.get("/health", (_req, res) => {
    res.json({ service: "request-service", status: "ok" });
});
app.post("/api/v1/requests", authMiddleware, async (req, res) => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: parsed.error.flatten() });
        return;
    }
    const record = {
        id: uuidv4(),
        requesterId: req.user.userId,
        category: parsed.data.category,
        description: parsed.data.description,
        urgency: parsed.data.urgency,
        district: parsed.data.district,
        city: parsed.data.city,
        peopleCount: parsed.data.peopleCount,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    requests.push(record);
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
    const filtered = requests.filter((item) => {
        const statusMatch = status ? item.status === status : true;
        const urgencyMatch = urgency ? item.urgency === urgency : true;
        const districtMatch = district ? item.district.toLowerCase() === String(district).toLowerCase() : true;
        const categoryMatch = category ? item.category === category : true;
        return statusMatch && urgencyMatch && districtMatch && categoryMatch;
    });
    res.json(filtered);
});
app.get("/api/v1/requests/:id", authMiddleware, (req, res) => {
    const item = requests.find((r) => r.id === req.params.id);
    if (!item) {
        res.status(404).json({ message: "Request not found" });
        return;
    }
    res.json(item);
});
app.patch("/api/v1/requests/:id", authMiddleware, (req, res) => {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: parsed.error.flatten() });
        return;
    }
    const item = requests.find((r) => r.id === req.params.id);
    if (!item) {
        res.status(404).json({ message: "Request not found" });
        return;
    }
    Object.assign(item, parsed.data, { updatedAt: new Date().toISOString() });
    res.json(item);
});
app.patch("/api/v1/requests/:id/status", authMiddleware, async (req, res) => {
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: parsed.error.flatten() });
        return;
    }
    const item = requests.find((r) => r.id === req.params.id);
    if (!item) {
        res.status(404).json({ message: "Request not found" });
        return;
    }
    const oldStatus = item.status;
    item.status = parsed.data.status;
    item.updatedAt = new Date().toISOString();
    await notify({
        userId: item.requesterId,
        message: `Request ${item.id} status changed from ${oldStatus} to ${item.status}`,
        requestId: item.id,
        oldStatus,
        newStatus: item.status,
        changedBy: req.user?.userId ?? "system"
    });
    res.json(item);
});
app.listen(port, () => {
    console.log(`Request service running on http://localhost:${port}`);
});
