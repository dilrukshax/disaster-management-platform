import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { DeliveryStatus, NotificationChannel, PrismaClient } from "@prisma/client";
import { z } from "zod";

dotenv.config({ path: "../../.env" });

type RealtimeEventType =
  | "notification:new"
  | "volunteer:verification-updated"
  | "mission:application-updated"
  | "mission:assignment-updated"
  | "mission:status-updated";

const app = express();
const port = Number(process.env.PORT ?? 3004);
const corsOrigin = process.env.SOCKET_CORS_ORIGIN ?? "*";
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ["GET", "POST"]
  }
});

const notificationSchema = z.object({
  userId: z.string().min(1),
  message: z.string().min(3),
  channel: z.nativeEnum(NotificationChannel).default(NotificationChannel.in_app)
});

const statusEventSchema = z.object({
  requestId: z.string().min(1),
  oldStatus: z.string().min(1),
  newStatus: z.string().min(1),
  changedBy: z.string().min(1)
});

const realtimeEventSchema = z.object({
  eventType: z.enum([
    "notification:new",
    "volunteer:verification-updated",
    "mission:application-updated",
    "mission:assignment-updated",
    "mission:status-updated"
  ]),
  userId: z.string().optional(),
  requestId: z.string().optional(),
  payload: z.record(z.string(), z.unknown()).default({})
});

const emitRealtime = (
  eventType: RealtimeEventType,
  payload: Record<string, unknown>,
  options: { userId?: string; requestId?: string } = {}
): void => {
  if (options.userId) {
    io.to(`user:${options.userId}`).emit(eventType, payload);
  }

  if (options.requestId) {
    io.to(`mission:${options.requestId}`).emit(eventType, payload);
  }

  io.emit(eventType, payload);
};

io.on("connection", (socket) => {
  socket.on("subscribe:user", (userId: string) => {
    if (typeof userId === "string" && userId.length) {
      socket.join(`user:${userId}`);
    }
  });

  socket.on("subscribe:mission", (requestId: string) => {
    if (typeof requestId === "string" && requestId.length) {
      socket.join(`mission:${requestId}`);
    }
  });

  socket.on("unsubscribe:user", (userId: string) => {
    if (typeof userId === "string" && userId.length) {
      socket.leave(`user:${userId}`);
    }
  });

  socket.on("unsubscribe:mission", (requestId: string) => {
    if (typeof requestId === "string" && requestId.length) {
      socket.leave(`mission:${requestId}`);
    }
  });
});

app.get("/health", (_req, res) => {
  res.json({
    service: "notification-service",
    status: "ok",
    connectedClients: io.engine.clientsCount
  });
});

app.post("/api/v1/notifications", async (req, res) => {
  const parsed = notificationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.flatten() });
    return;
  }

  const notification = await prisma.notification.create({
    data: {
      userId: parsed.data.userId,
      message: parsed.data.message,
      channel: parsed.data.channel,
      deliveryStatus: DeliveryStatus.delivered
    }
  });

  emitRealtime(
    "notification:new",
    {
      id: notification.id,
      userId: notification.userId,
      message: notification.message,
      channel: notification.channel,
      createdAt: notification.createdAt
    },
    { userId: notification.userId }
  );

  res.status(201).json(notification);
});

app.get("/api/v1/notifications/user/:userId", async (req, res) => {
  const list = await prisma.notification.findMany({
    where: { userId: req.params.userId },
    orderBy: { createdAt: "desc" }
  });
  res.json(list);
});

app.post("/api/v1/status-events", async (req, res) => {
  const parsed = statusEventSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.flatten() });
    return;
  }

  const event = await prisma.statusEvent.create({
    data: {
      requestId: parsed.data.requestId,
      oldStatus: parsed.data.oldStatus,
      newStatus: parsed.data.newStatus,
      changedBy: parsed.data.changedBy
    }
  });

  emitRealtime(
    "mission:status-updated",
    {
      id: event.id,
      requestId: event.requestId,
      oldStatus: event.oldStatus,
      newStatus: event.newStatus,
      changedBy: event.changedBy,
      timestamp: event.timestamp,
      statusLabel: event.newStatus === "in_progress" ? "ongoing" : event.newStatus
    },
    { requestId: event.requestId }
  );

  res.status(201).json(event);
});

app.get("/api/v1/status-events/request/:requestId", async (req, res) => {
  const list = await prisma.statusEvent.findMany({
    where: { requestId: req.params.requestId },
    orderBy: { timestamp: "desc" }
  });
  res.json(list);
});

app.post("/api/v1/events", async (req, res) => {
  const parsed = realtimeEventSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.flatten() });
    return;
  }

  emitRealtime(parsed.data.eventType, parsed.data.payload, {
    userId: parsed.data.userId,
    requestId: parsed.data.requestId
  });

  res.status(202).json({ status: "queued" });
});

server.listen(port, () => {
  console.log(`Notification service running on http://localhost:${port}`);
});
