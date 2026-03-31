import jwt from "jsonwebtoken";
import type { AuthTokenPayload } from "../types.js";

const EXPIRY = "24h";

export function parseBearerToken(header: string | undefined): string | null {
  if (!header || !header.startsWith("Bearer ")) {
    return null;
  }

  const token = header.slice("Bearer ".length).trim();
  return token.length > 0 ? token : null;
}

export function signAuthToken(payload: AuthTokenPayload, jwtSecret: string): string {
  return jwt.sign(payload, jwtSecret, { expiresIn: EXPIRY });
}

export function verifyAuthToken(token: string, jwtSecret: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, jwtSecret) as AuthTokenPayload;
  } catch {
    return null;
  }
}
