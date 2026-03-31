import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { appRoles } from "./types.js";
import type { AppRole, AuthRequest } from "./types.js";
import { signAuthToken } from "./lib/jwt.js";
import { createAuthMiddleware, requireRoles } from "./lib/middleware.js";
import { hashPassword, verifyPassword } from "./lib/password.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../..", ".env") });
dotenv.config();

const prisma = new PrismaClient();
const app = express();

const resolvePort = (): number => {
  const explicit = process.env.AUTH_SERVICE_PORT ?? process.env.PORT;
  if (explicit) {
    const parsed = Number(explicit);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  try {
    const fromUrl = process.env.AUTH_SERVICE_URL ? Number(new URL(process.env.AUTH_SERVICE_URL).port) : NaN;
    if (!Number.isNaN(fromUrl)) {
      return fromUrl;
    }
  } catch {
    // ignore malformed URL and continue with default
  }

  return 3001;
};

const port = resolvePort();
const jwtSecret = process.env.JWT_SECRET ?? "dev-super-secret";

const corsOrigins = (process.env.WEB_ORIGIN ?? "http://localhost:3000")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins,
    credentials: true
  })
);
app.use(express.json());

const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  password: z.string().min(8),
  role: z.enum(["requester", "volunteer"]).default("requester"),
  district: z.string().min(2),
  city: z.string().min(2)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const roleUpdateSchema = z.object({
  role: z.enum(appRoles)
});

function userResponse(user: {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: AppRole;
  district: string;
  city: string;
}) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    district: user.district,
    city: user.city
  };
}

const authMiddleware = createAuthMiddleware(jwtSecret);

async function seedDefaultAdmin(): Promise<void> {
  const passwordHash = await hashPassword("Admin@123");
  await prisma.user.upsert({
    where: { email: "coordinator@relieflink.local" },
    update: {
      fullName: "System Super Admin",
      passwordHash,
      role: "admin",
      district: "Colombo",
      city: "Colombo"
    },
    create: {
      fullName: "System Super Admin",
      email: "coordinator@relieflink.local",
      phone: "+94000000000",
      passwordHash,
      role: "admin",
      district: "Colombo",
      city: "Colombo"
    }
  });
}

app.get("/health", (_req, res) => {
  res.json({ service: "auth-service", status: "ok" });
});

app.post("/api/v1/auth/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.flatten() });
    return;
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ message: "Email already exists" });
    return;
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user.create({
    data: {
      fullName: parsed.data.fullName,
      email,
      phone: parsed.data.phone,
      passwordHash,
      role: parsed.data.role,
      district: parsed.data.district,
      city: parsed.data.city
    }
  });

  const token = signAuthToken({ userId: user.id, email: user.email, role: user.role }, jwtSecret);

  res.status(201).json({
    token,
    user: userResponse(user)
  });
});

app.post("/api/v1/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.flatten() });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const matched = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!matched) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = signAuthToken({ userId: user.id, email: user.email, role: user.role }, jwtSecret);

  res.json({
    token,
    user: userResponse(user)
  });
});

app.get("/api/v1/auth/me", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  const user = userId ? await prisma.user.findUnique({ where: { id: userId } }) : null;
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json(userResponse(user));
});

app.get("/api/v1/users/:id", authMiddleware, async (req: AuthRequest, res) => {
  const requester = req.user;
  const requestedUserId = req.params.id;

  const canView =
    requester &&
    (requester.userId === requestedUserId || requester.role === "admin" || requester.role === "coordinator");

  if (!canView) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: requestedUserId } });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json(userResponse(user));
});

app.patch(
  "/api/v1/users/:id/role",
  authMiddleware,
  requireRoles(["coordinator", "admin"]),
  async (req, res) => {
    const parsed = roleUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.flatten() });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { role: parsed.data.role }
    });

    res.json({ message: "Role updated", userId: updated.id, role: updated.role });
  }
);

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled auth-service error", error);
  res.status(500).json({ message: "Internal server error" });
});

seedDefaultAdmin()
  .then(() => {
    app.listen(port, () => {
      console.log(`Auth service running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start auth service", error);
    process.exit(1);
  });
