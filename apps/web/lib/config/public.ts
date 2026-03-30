"use client";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3005";

export type PublicConfig = {
  appName: string;
  apiBaseUrl: string;
  notificationWsUrl: string;
  services: Record<string, string>;
};

let cachedConfig: PublicConfig | null = null;

export async function fetchPublicConfig(force = false): Promise<PublicConfig> {
  if (cachedConfig && !force) {
    return cachedConfig;
  }

  try {
    const response = await fetch(`${API_BASE}/api/v1/config/public`);
    if (!response.ok) {
      throw new Error("Failed to load public config");
    }

    cachedConfig = (await response.json()) as PublicConfig;
    return cachedConfig;
  } catch {
    cachedConfig = {
      appName: "ReliefLink",
      apiBaseUrl: API_BASE,
      notificationWsUrl: process.env.NEXT_PUBLIC_NOTIFICATION_WS_URL ?? "http://localhost:3004",
      services: {
        requests: "/api/v1/requests",
        volunteers: "/api/v1/volunteers",
        assignments: "/api/v1/assignments",
        notifications: "/api/v1/notifications",
        statusEvents: "/api/v1/status-events"
      }
    };

    return cachedConfig;
  }
}
