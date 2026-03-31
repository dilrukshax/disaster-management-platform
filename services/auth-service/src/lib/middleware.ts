import type { NextFunction, Response } from "express";
import type { AppRole, AuthRequest } from "../types.js";
import { parseBearerToken, verifyAuthToken } from "./jwt.js";

export function createAuthMiddleware(jwtSecret: string) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = parseBearerToken(req.headers.authorization);

    if (!token) {
      res.status(401).json({ message: "Missing bearer token" });
      return;
    }

    const payload = verifyAuthToken(token, jwtSecret);
    if (!payload) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    req.user = payload;
    next();
  };
}

export function requireRoles(roles: AppRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  };
}
