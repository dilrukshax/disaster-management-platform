import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

dotenv.config({ path: "../../.env" });

type Notification = {
  id: string;
  userId: string;
  message: string;
  channel: "in_app" | "email";
  deliveryStatus: "queued" | "delivered" | "failed";
  createdAt: string;
};

type StatusEvent = {
  id: string;
  requestId: string;
  oldStatus: string;
  newStatus: string;
  changedBy: string;
  timestamp: string;
};

const app = express();
const port = Number(process.env.PORT ?? 3004);

app.use(cors());
app.use(express.json());

const notifications: Notification[] = [];
const statusEvents: StatusEvent[] = [];

const notificationSchema = z.object({
  userId: z.string().min(1),
  message: z.string().min(3),
  channel: z.enum(["in_app", "email"]).default("in_app")
});

const statusEventSchema = z.object({
  requestId: z.string().min(1),
  oldStatus: z.string().min(1),
  newStatus: z.string().min(1),
  changedBy: z.string().min(1)
});

app.get("/health", (_req, res) => {
  res.json({ service: "notification-service", status: "ok" });
});

app.post("/api/v1/notifications", (req, res) => {
  const parsed = notificationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.flatten() });
    return;
  }

  const notification: Notification = {
    id: uuidv4(),
    userId: parsed.data.userId,
    message: parsed.data.message,
    channel: parsed.data.channel,
    deliveryStatus: "delivered",
    createdAt: new Date().toISOString()
  };

  notifications.push(notification);
  res.status(201).json(notification);
});

app.get("/api/v1/notifications/user/:userId", (req, res) => {
  const list = notifications.filter((n) => n.userId === req.params.userId);
  res.json(list);
});

app.post("/api/v1/status-events", (req, res) => {
  const parsed = statusEventSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.flatten() });
    return;
  }

  const event: StatusEvent = {
    id: uuidv4(),
    requestId: parsed.data.requestId,
    oldStatus: parsed.data.oldStatus,
    newStatus: parsed.data.newStatus,
    changedBy: parsed.data.changedBy,
    timestamp: new Date().toISOString()
  };

  statusEvents.push(event);
  res.status(201).json(event);
});

app.get("/api/v1/status-events/request/:requestId", (req, res) => {
  const list = statusEvents.filter((s) => s.requestId === req.params.requestId);
  res.json(list);
});

app.listen(port, () => {
  console.log(`Notification service running on http://localhost:${port}`);
});
