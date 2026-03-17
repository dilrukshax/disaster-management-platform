"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api/client";
import { SERVICE_URLS } from "../../lib/api/urls";
import { saveSession } from "../../lib/auth/session";

type LoginResponse = {
  token: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("coordinator@relieflink.local");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await apiFetch<LoginResponse>(SERVICE_URLS.auth, "/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      saveSession(data.token, data.user);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div className="card">
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Sign In</button>
      </form>
      {error ? <p>{error}</p> : null}
    </div>
  );
}
