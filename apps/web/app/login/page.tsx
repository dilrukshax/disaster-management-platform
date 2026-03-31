"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import { apiFetch } from "@/lib/api/client";
import { saveSession, type SessionUser } from "@/lib/auth/session";

type LoginResponse = {
  token: string;
  user: SessionUser;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("coordinator@relieflink.local");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiFetch<LoginResponse>("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      saveSession(response.token, response.user);
      router.push("/dashboard");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Sign in to ReliefLink"
      subtitle="Authenticate with your registered emergency response account."
      alternateLink={{ href: "/register", label: "Need a new requester or volunteer account? Register here." }}
    >
      <form className="space-y-3" onSubmit={onSubmit}>
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@relieflink.local"
            required
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-ocean-500 px-4 py-2.5 font-semibold text-white transition hover:bg-ocean-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {error ? <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
    </AuthShell>
  );
}
