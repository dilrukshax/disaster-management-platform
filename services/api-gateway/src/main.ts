import cors from "cors";
import dotenv from "dotenv";
import express, { Request } from "express";

dotenv.config({ path: "../../.env" });

const app = express();
const port = Number(process.env.API_GATEWAY_PORT ?? 3005);
const configServiceUrl = process.env.CONFIG_SERVICE_URL ?? "http://localhost:3006";
const configToken = process.env.CONFIG_SERVICE_TOKEN ?? "";

type RouteMap = {
    auth: string;
    request: string;
    volunteer: string;
    notification: string;
};

let routes: RouteMap = {
    auth: process.env.AUTH_SERVICE_URL ?? "http://localhost:3001",
    request: process.env.REQUEST_SERVICE_URL ?? "http://localhost:3002",
    volunteer: process.env.VOLUNTEER_SERVICE_URL ?? "http://localhost:3003",
    notification: process.env.NOTIFICATION_SERVICE_URL ?? "http://localhost:3004"
};

app.use(cors());
app.use(express.json());

const loadRoutesFromConfigServer = async (): Promise<void> => {
    try {
        const response = await fetch(`${configServiceUrl}/api/v1/config/internal`, {
            headers: configToken ? { "x-config-token": configToken } : {}
        });

        if (!response.ok) {
            return;
        }

        const payload = (await response.json()) as {
            serviceUrls: {
                authServiceUrl: string;
                requestServiceUrl: string;
                volunteerServiceUrl: string;
                notificationServiceUrl: string;
            };
        };

        routes = {
            auth: payload.serviceUrls.authServiceUrl,
            request: payload.serviceUrls.requestServiceUrl,
            volunteer: payload.serviceUrls.volunteerServiceUrl,
            notification: payload.serviceUrls.notificationServiceUrl
        };
    } catch {
        // Fallback to environment configuration when config server is unavailable.
    }
};

const resolveTarget = (pathname: string): string | null => {
    if (pathname.startsWith("/api/v1/auth") || pathname.startsWith("/api/v1/users")) {
        return routes.auth;
    }

    if (pathname.startsWith("/api/v1/requests")) {
        return routes.request;
    }

    if (
        pathname.startsWith("/api/v1/volunteers") ||
        pathname.startsWith("/api/v1/resources") ||
        pathname.startsWith("/api/v1/assignments")
    ) {
        return routes.volunteer;
    }

    if (pathname.startsWith("/api/v1/notifications") || pathname.startsWith("/api/v1/status-events")) {
        return routes.notification;
    }

    if (pathname.startsWith("/api/v1/config")) {
        return configServiceUrl;
    }

    return null;
};

const createForwardBody = (req: Request): string | undefined => {
    if (["GET", "HEAD"].includes(req.method)) {
        return undefined;
    }

    if (!req.body || Object.keys(req.body).length === 0) {
        return undefined;
    }

    return JSON.stringify(req.body);
};

const forward = async (req: Request, res: express.Response): Promise<void> => {
    const target = resolveTarget(req.path);

    if (!target) {
        res.status(404).json({ message: "Route not found in API gateway" });
        return;
    }

    const targetUrl = new URL(req.originalUrl, target);
    const headers = new Headers();

    for (const [key, value] of Object.entries(req.headers)) {
        if (!value || key.toLowerCase() === "host" || key.toLowerCase() === "content-length") {
            continue;
        }

        if (Array.isArray(value)) {
            headers.set(key, value.join(","));
        } else {
            headers.set(key, value);
        }
    }

    const response = await fetch(targetUrl, {
        method: req.method,
        headers,
        body: createForwardBody(req)
    });

    res.status(response.status);
    const contentType = response.headers.get("content-type");
    if (contentType) {
        res.setHeader("content-type", contentType);
    }

    const text = await response.text();
    res.send(text);
};

app.get("/health", async (_req, res) => {
    const checks = await Promise.allSettled([
        fetch(`${routes.auth}/health`),
        fetch(`${routes.request}/health`),
        fetch(`${routes.volunteer}/health`),
        fetch(`${routes.notification}/health`),
        fetch(`${configServiceUrl}/health`)
    ]);

    const mapCheck = (index: number) => {
        const item = checks[index];
        return item.status === "fulfilled" && item.value.ok ? "ok" : "down";
    };

    res.json({
        service: "api-gateway",
        status: "ok",
        dependencies: {
            authService: mapCheck(0),
            requestService: mapCheck(1),
            volunteerService: mapCheck(2),
            notificationService: mapCheck(3),
            configService: mapCheck(4)
        }
    });
});

app.all("/api/*", async (req, res) => {
    await forward(req, res);
});

loadRoutesFromConfigServer().finally(() => {
    app.listen(port, () => {
        console.log(`API gateway running on http://localhost:${port}`);
    });
});

setInterval(() => {
    loadRoutesFromConfigServer().catch(() => undefined);
}, 30_000);
