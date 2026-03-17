import bcrypt from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
dotenv.config({ path: "../../.env" });
const app = express();
const port = Number(process.env.PORT ?? 3001);
const jwtSecret = process.env.JWT_SECRET ?? "dev-super-secret";
app.use(cors());
app.use(express.json());
const users = [];
const seedAdmin = async () => {
    if (users.length > 0) {
        return;
    }
    const passwordHash = await bcrypt.hash("Admin@123", 10);
    users.push({
        id: uuidv4(),
        fullName: "System Coordinator",
        email: "coordinator@relieflink.local",
        phone: "+94000000000",
        passwordHash,
        role: "coordinator",
        district: "Colombo",
        city: "Colombo",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
};
const registerSchema = z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(8),
    password: z.string().min(8),
    role: z.enum(["requester", "volunteer", "coordinator"]).default("requester"),
    district: z.string().min(2),
    city: z.string().min(2)
});
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});
const roleUpdateSchema = z.object({
    role: z.enum(["requester", "volunteer", "coordinator", "admin"])
});
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ message: "Missing bearer token" });
        return;
    }
    const token = authHeader.replace("Bearer ", "");
    try {
        const payload = jwt.verify(token, jwtSecret);
        req.user = payload;
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
app.get("/health", (_req, res) => {
    res.json({ service: "auth-service", status: "ok" });
});
app.post("/api/v1/auth/register", async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: parsed.error.flatten() });
        return;
    }
    const existing = users.find((u) => u.email.toLowerCase() === parsed.data.email.toLowerCase());
    if (existing) {
        res.status(409).json({ message: "Email already exists" });
        return;
    }
    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const user = {
        id: uuidv4(),
        fullName: parsed.data.fullName,
        email: parsed.data.email.toLowerCase(),
        phone: parsed.data.phone,
        passwordHash,
        role: parsed.data.role,
        district: parsed.data.district,
        city: parsed.data.city,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    users.push(user);
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
    const user = users.find((u) => u.email === parsed.data.email.toLowerCase());
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
app.get("/api/v1/auth/me", authMiddleware, (req, res) => {
    const user = users.find((u) => u.id === req.user?.userId);
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
app.get("/api/v1/users/:id", authMiddleware, (req, res) => {
    if (req.user?.userId !== req.params.id && !["admin", "coordinator"].includes(req.user?.role ?? "")) {
        res.status(403).json({ message: "Forbidden" });
        return;
    }
    const user = users.find((u) => u.id === req.params.id);
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
app.patch("/api/v1/users/:id/role", authMiddleware, requireCoordinatorOrAdmin, (req, res) => {
    const parsed = roleUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: parsed.error.flatten() });
        return;
    }
    const user = users.find((u) => u.id === req.params.id);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    user.role = parsed.data.role;
    user.updatedAt = new Date().toISOString();
    res.json({ message: "Role updated", userId: user.id, role: user.role });
});
seedAdmin().then(() => {
    app.listen(port, () => {
        console.log(`Auth service running on http://localhost:${port}`);
    });
});
