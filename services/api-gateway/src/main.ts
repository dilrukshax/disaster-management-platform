import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../..", ".env") });
dotenv.config();

const app = express();

const resolvePort = (): number => {
  const explicit = process.env.API_GATEWAY_PORT ?? process.env.PORT;
  if (explicit) {
    const parsed = Number(explicit);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  try {
    const fromUrl = process.env.API_GATEWAY_URL ? Number(new URL(process.env.API_GATEWAY_URL).port) : NaN;
    if (!Number.isNaN(fromUrl)) {
      return fromUrl;
    }
  } catch {
    // ignore malformed URL and continue with default
  }

  return 3005;
};

const port = resolvePort();
const authServiceUrl = process.env.AUTH_SERVICE_URL ?? "http://localhost:3001";
const webOrigin = (process.env.WEB_ORIGIN ?? "http://localhost:3000")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

const corsMiddleware = cors({
  origin: webOrigin,
  credentials: true
});

app.use(corsMiddleware);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    service: "api-gateway",
    status: "ok",
    upstreams: {
      auth: authServiceUrl
    }
  });
});

app.get("/api/v1/config/public", (_req, res) => {
  res.json({
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? `http://localhost:${port}`,
    authServiceUrl,
    notificationWsUrl:
      process.env.NEXT_PUBLIC_NOTIFICATION_WS_URL ?? process.env.NOTIFICATION_WS_URL ?? "http://localhost:3004"
  });
});

function copyRequestHeaders(req: Request): Headers {
  const headers = new Headers();

  if (req.headers.authorization) {
    headers.set("authorization", req.headers.authorization);
  }

  if (req.headers["content-type"]) {
    headers.set("content-type", String(req.headers["content-type"]));
  }

  return headers;
}

async function proxyToAuthService(req: Request, res: Response): Promise<void> {
  const targetUrl = new URL(req.originalUrl, authServiceUrl);
  const method = req.method.toUpperCase();
  const headers = copyRequestHeaders(req);

  const hasBody = method !== "GET" && method !== "HEAD";
  const body = hasBody ? JSON.stringify(req.body ?? {}) : undefined;

  try {
    const upstream = await fetch(targetUrl, {
      method,
      headers,
      body
    });

    const text = await upstream.text();
    const contentType = upstream.headers.get("content-type");

    if (contentType) {
      res.setHeader("content-type", contentType);
    }

    res.status(upstream.status).send(text);
  } catch (error) {
    console.error("Gateway proxy error", error);
    res.status(502).json({ message: "Bad gateway" });
  }
}

app.all(/^\/api\/v1\/(auth|users)(\/.*)?$/, (req, res) => {
  void proxyToAuthService(req, res);
});

app.listen(port, () => {
  console.log(`API gateway running on http://localhost:${port}`);
});
