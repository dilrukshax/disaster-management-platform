"use client";

import { FormEvent, useState } from "react";
import NavBar from "../../components/NavBar";
import { apiFetch } from "../../lib/api/client";
import { SERVICE_URLS } from "../../lib/api/urls";

export default function AssignmentsPage() {
  const [requestId, setRequestId] = useState("");
  const [volunteerId, setVolunteerId] = useState("");
  const [resourceId, setResourceId] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await apiFetch<{ id: string }>(SERVICE_URLS.volunteer, "/api/v1/assignments", {
        method: "POST",
        body: JSON.stringify({ requestId, volunteerId: volunteerId || undefined, resourceId: resourceId || undefined })
      });
      setMessage(`Assignment created: ${response.id}`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <>
      <NavBar />
      <div className="card">
        <h1>Assignments</h1>
        <form onSubmit={onSubmit}>
          <input value={requestId} onChange={(e) => setRequestId(e.target.value)} placeholder="Request ID" />
          <input value={volunteerId} onChange={(e) => setVolunteerId(e.target.value)} placeholder="Volunteer ID (optional)" />
          <input value={resourceId} onChange={(e) => setResourceId(e.target.value)} placeholder="Resource ID (optional)" />
          <button type="submit">Assign</button>
        </form>
        {message ? <p>{message}</p> : null}
      </div>
    </>
  );
}
