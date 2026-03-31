"use client";

import { useRouter } from "next/navigation";
import { DashboardProfile } from "@/components/DashboardProfile";
import { clearSession } from "@/lib/auth/session";

export default function AdminDashboardPage() {
  const router = useRouter();

  return (
    <section className="mx-auto mt-10 max-w-4xl rounded-3xl border border-ocean-100 bg-white/85 p-8 shadow-soft backdrop-blur">
      <p className="font-heading text-xs uppercase tracking-[0.2em] text-ember-500">Command Workspace</p>
      <h1 className="mt-2 font-heading text-3xl text-slate-900">Admin Command Center</h1>
      <p className="mt-3 text-slate-600">Manage privileged users and oversee operational access control.</p>
      <DashboardProfile />
      <button
        onClick={() => {
          clearSession();
          router.push("/login");
        }}
        className="mt-6 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
      >
        Sign out
      </button>
    </section>
  );
}
