import bcrypt from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient, Role } from "../generated/client/index.js";
import { z } from "zod";

dotenv.config({ path: "../../.env" });

type AuthRequest = Request & {
  user?: {
    userId: string;
    email: string;
    role: Role;
  };
};

const app = express();
const port = Number(process.env.PORT ?? 3001);
const jwtSecret = process.env.JWT_SECRET ?? "dev-super-secret";
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  password: z.string().min(8),
  role: z.nativeEnum(Role).default(Role.requester),
  district: z.string().min(2),
  city: z.string().min(2)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const roleUpdateSchema = z.object({
  role: z.nativeEnum(Role)
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
  if (!req.user || (req.user.role !== Role.coordinator && req.user.role !== Role.admin)) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  next();
};

const seedAdmin = async (): Promise<void> => {
  const passwordHash = await bcrypt.hash("Admin@123", 10);
  await prisma.user.upsert({
    where: { email: "coordinator@relieflink.local" },
    update: {},
    create: {
      fullName: "System Coordinator",
      email: "coordinator@relieflink.local",
      phone: "+94000000000",
      passwordHash,
      role: Role.coordinator,
      district: "Colombo",
      city: "Colombo"
    }
  });
};

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

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
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

  const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, jwtSecret, {
    expiresIn: "1d"
  });

  res.status(201).json({
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      district: user.district,
      city: user.city
    }
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

  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!ok) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, jwtSecret, {
    expiresIn: "1d"
  });

  res.json({
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      district: user.district,
      city: user.city
    }
  });
});

app.get("/api/v1/auth/me", authMiddleware, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user?.userId } });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    district: user.district,
    city: user.city
  });
});

app.get("/api/v1/users/:id", authMiddleware, async (req: AuthRequest, res) => {
  if (
    req.user?.userId !== req.params.id &&
    req.user?.role !== Role.admin &&
    req.user?.role !== Role.coordinator
  ) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    district: user.district,
    city: user.city
  });
});

app.patch("/api/v1/users/:id/role", authMiddleware, requireCoordinatorOrAdmin, async (req, res) => {
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

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { role: parsed.data.role }
  });

  res.json({ message: "Role updated", userId: user.id, role: user.role });
});

seedAdmin().then(() => {
  app.listen(port, () => {
    console.log(`Auth service running on http://localhost:${port}`);
  });
});
