"use client";

import { FormEvent, useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import { apiFetch } from "../../lib/api/client";
import { getUser } from "../../lib/auth/session";
import { SERVICE_URLS } from "../../lib/api/urls";

type Resource = {
  id: string;
  category: string;
  quantity: number;
  district: string;
  city: string;
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [form, setForm] = useState({ category: "water", quantity: 10, district: "Colombo", city: "Colombo" });

  const load = () => {
    apiFetch<Resource[]>(SERVICE_URLS.volunteer, "/api/v1/resources")
      .then(setResources)
      .catch(() => setResources([]));
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const user = getUser<{ id: string }>();
    if (!user) return;

    await apiFetch(SERVICE_URLS.volunteer, "/api/v1/resources", {
      method: "POST",
      body: JSON.stringify({ ...form, ownerId: user.id })
    });

    load();
  };

  return (
    <>
      <NavBar />
      <div className="card">
        <h1>Resources</h1>
        <form onSubmit={onSubmit}>
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" />
          <input type="number" min={1} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
          <input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} placeholder="District" />
          <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" />
          <button type="submit">Add Resource</button>
        </form>
      </div>
      {resources.map((r) => (
        <div className="card" key={r.id}>
          <p>
            {r.category} - qty {r.quantity}
          </p>
          <p>
            {r.district}, {r.city}
          </p>
        </div>
      ))}
    </>
  );
}
