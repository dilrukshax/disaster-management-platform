import type { Request } from "express";

export const appRoles = ["requester", "volunteer", "coordinator", "admin"] as const;

export type AppRole = (typeof appRoles)[number];

export type AuthTokenPayload = {
  userId: string;
  email: string;
  role: AppRole;
};

export type AuthRequest = Request & {
  user?: AuthTokenPayload;
};
