import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { DeliveryStatus, NotificationChannel, PrismaClient } from "@prisma/client";
import { z } from "zod";

dotenv.config({ path: "../../.env" });

const app = express();
const port = Number(process.env.PORT ?? 3004);
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

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

app.get("/health", (_req, res) => {
  res.json({ service: "notification-service", status: "ok" });
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

  res.status(201).json(event);
});

app.get("/api/v1/status-events/request/:requestId", async (req, res) => {
  const list = await prisma.statusEvent.findMany({
    where: { requestId: req.params.requestId },
    orderBy: { timestamp: "desc" }
  });
  res.json(list);
});

app.listen(port, () => {
  console.log(`Notification service running on http://localhost:${port}`);
});
