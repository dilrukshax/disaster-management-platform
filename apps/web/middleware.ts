import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import type { Role } from "@/lib/auth/roles";
import { routeForRole } from "@/lib/auth/roles";

type TokenPayload = {
  role?: Role;
};

function decodeJwtPayload(token: string): TokenPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  try {
    const payload = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(parts[1].length / 4) * 4, "=");

    return JSON.parse(atob(payload)) as TokenPayload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isDashboardPage = pathname.startsWith("/dashboard");

  if (!token && isDashboardPage) {
    const target = new URL("/login", request.url);
    target.searchParams.set("next", pathname);
    return NextResponse.redirect(target);
  }

  const payload = token ? decodeJwtPayload(token) : null;
  const role = payload?.role;

  if (isAuthPage && role) {
    return NextResponse.redirect(new URL(routeForRole(role), request.url));
  }

  if (!role || !isDashboardPage) {
    return NextResponse.next();
  }

  if (pathname === "/dashboard") {
    return NextResponse.redirect(new URL(routeForRole(role), request.url));
  }

  if (pathname.startsWith("/dashboard/admin") && role !== "admin" && role !== "coordinator") {
    return NextResponse.redirect(new URL(routeForRole(role), request.url));
  }

  if (pathname.startsWith("/dashboard/requester") && role !== "requester") {
    return NextResponse.redirect(new URL(routeForRole(role), request.url));
  }

  if (pathname.startsWith("/dashboard/volunteer") && role !== "volunteer") {
    return NextResponse.redirect(new URL(routeForRole(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"]
};
