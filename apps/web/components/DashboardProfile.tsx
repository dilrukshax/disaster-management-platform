"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api/client";
import { clearSession, getUser, saveSession, type SessionUser } from "@/lib/auth/session";

type ProfileState =
  | { status: "loading" }
  | { status: "ready"; user: SessionUser }
  | { status: "error"; message: string };

export function DashboardProfile() {
  const router = useRouter();
  const [state, setState] = useState<ProfileState>({ status: "loading" });

  useEffect(() => {
    const bootstrap = async () => {
      const localUser = getUser();
      if (!localUser) {
        clearSession();
        router.replace("/login");
        return;
      }

      try {
        const me = await apiFetch<SessionUser>("/api/v1/auth/me");
        const token = window.localStorage.getItem("relieflink_token");
        if (token) {
          saveSession(token, me);
        }
        setState({ status: "ready", user: me });
      } catch (error) {
        clearSession();
        setState({ status: "error", message: error instanceof Error ? error.message : "Session expired" });
        router.replace("/login");
      }
    };

    void bootstrap();
  }, [router]);

  if (state.status === "loading") {
    return <p className="text-sm text-slate-500">Verifying your secure session...</p>;
  }

  if (state.status === "error") {
    return <p className="text-sm text-rose-600">{state.message}</p>;
  }

  const { user } = state;

  return (
    <div className="mt-5 rounded-2xl border border-ocean-100 bg-white/80 p-4 text-sm shadow-sm">
      <p className="font-semibold text-slate-800">Signed in as {user.fullName}</p>
      <p className="text-slate-600">{user.email}</p>
      <p className="text-slate-600">
        Role: <span className="font-semibold uppercase text-ocean-700">{user.role}</span>
      </p>
      <p className="text-slate-600">
        Region: {user.city}, {user.district}
      </p>
    </div>
  );
}
