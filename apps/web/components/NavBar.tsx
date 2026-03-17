"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearSession, getUser } from "../lib/auth/session";

type SessionUser = {
  fullName: string;
  role: string;
};

export default function NavBar() {
  const router = useRouter();
  const user = typeof window === "undefined" ? null : getUser<SessionUser>();

  return (
    <div className="nav">
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/requests">Requests</Link>
      <Link href="/requests/new">New Request</Link>
      <Link href="/volunteers">Volunteers</Link>
      <Link href="/resources">Resources</Link>
      <Link href="/assignments">Assignments</Link>
      <Link href="/notifications">Notifications</Link>
      <Link href="/admin">Admin</Link>
      <span>{user ? `${user.fullName} (${user.role})` : "Guest"}</span>
      <button
        onClick={() => {
          clearSession();
          router.push("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}
