"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import { apiFetch } from "@/lib/api/client";
import { saveSession, type SessionUser } from "@/lib/auth/session";

type RegisterResponse = {
  token: string;
  user: SessionUser;
};

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "requester",
    district: "",
    city: ""
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiFetch<RegisterResponse>("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify(form)
      });

      saveSession(response.token, response.user);
      router.push("/dashboard");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create an emergency account"
      subtitle="Requester and volunteer onboarding is open. Command roles are invite-managed by admins."
      alternateLink={{ href: "/login", label: "Already registered? Sign in instead." }}
    >
      <form className="grid gap-3 sm:grid-cols-2" onSubmit={onSubmit}>
        <label className="text-sm font-medium text-slate-700 sm:col-span-2">
          Full name
          <input
            value={form.fullName}
            onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
            required
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Phone
          <input
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            required
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Account type
          <select
            value={form.role}
            onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
          >
            <option value="requester">Requester</option>
            <option value="volunteer">Volunteer</option>
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700">
          District
          <input
            value={form.district}
            onChange={(event) => setForm((prev) => ({ ...prev, district: event.target.value }))}
            required
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          City
          <input
            value={form.city}
            onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="sm:col-span-2 w-full rounded-xl bg-ocean-500 px-4 py-2.5 font-semibold text-white transition hover:bg-ocean-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      {error ? <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
    </AuthShell>
  );
}
