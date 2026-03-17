export const SERVICE_URLS = {
  auth: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL ?? "http://localhost:3001",
  request: process.env.NEXT_PUBLIC_REQUEST_SERVICE_URL ?? "http://localhost:3002",
  volunteer: process.env.NEXT_PUBLIC_VOLUNTEER_SERVICE_URL ?? "http://localhost:3003",
  notification: process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL ?? "http://localhost:3004"
};
