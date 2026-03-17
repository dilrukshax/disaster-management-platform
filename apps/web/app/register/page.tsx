"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api/client";
import { SERVICE_URLS } from "../../lib/api/urls";
import { saveSession } from "../../lib/auth/session";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "requester",
    district: "",
    city: ""
  });
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const data = await apiFetch<{ token: string; user: unknown }>(SERVICE_URLS.auth, "/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify(form)
      });
      saveSession(data.token, data.user);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <div className="card">
      <h1>Register</h1>
      <form onSubmit={onSubmit}>
        <input placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="requester">requester</option>
          <option value="volunteer">volunteer</option>
          <option value="coordinator">coordinator</option>
        </select>
        <input placeholder="District" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
        <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <button type="submit">Create Account</button>
      </form>
      {error ? <p>{error}</p> : null}
    </div>
  );
}
