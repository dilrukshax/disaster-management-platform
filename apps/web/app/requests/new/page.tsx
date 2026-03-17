"use client";

import { FormEvent, useState } from "react";
import NavBar from "../../../components/NavBar";
import { apiFetch } from "../../../lib/api/client";
import { SERVICE_URLS } from "../../../lib/api/urls";

export default function NewRequestPage() {
  const [form, setForm] = useState({
    category: "water",
    description: "",
    urgency: "high",
    district: "",
    city: "",
    peopleCount: 1
  });
  const [message, setMessage] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const data = await apiFetch<{ id: string }>(SERVICE_URLS.request, "/api/v1/requests", {
        method: "POST",
        body: JSON.stringify({ ...form, peopleCount: Number(form.peopleCount) })
      });
      setMessage(`Request created: ${data.id}`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <>
      <NavBar />
      <div className="card">
        <h1>Create Request</h1>
        <form onSubmit={onSubmit}>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="water">water</option>
            <option value="food">food</option>
            <option value="medicine">medicine</option>
            <option value="shelter">shelter</option>
            <option value="rescue">rescue</option>
            <option value="transport">transport</option>
            <option value="other">other</option>
          </select>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })}>
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
          <input placeholder="District" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
          <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <input type="number" min={1} value={form.peopleCount} onChange={(e) => setForm({ ...form, peopleCount: Number(e.target.value) })} />
          <button type="submit">Submit Request</button>
        </form>
        {message ? <p>{message}</p> : null}
      </div>
    </>
  );
}
