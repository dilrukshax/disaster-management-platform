export const roles = ["requester", "volunteer", "coordinator", "admin"] as const;

export type Role = (typeof roles)[number];

export function routeForRole(role: Role): string {
  if (role === "requester") {
    return "/dashboard/requester";
  }

  if (role === "volunteer") {
    return "/dashboard/volunteer";
  }

  return "/dashboard/admin";
}
