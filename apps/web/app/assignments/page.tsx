"use client";

import { FormEvent, useState } from "react";
import NavBar from "../../components/NavBar";
import { apiFetch } from "../../lib/api/client";
import { SERVICE_URLS } from "../../lib/api/urls";

type Assignment = {
  id: string;
  requestId: string;
  volunteerId?: string;
  resourceId?: string;
  applicationId?: string;
  status: string;
  assignedAt: string;
};

export default function AssignmentsPage() {
  const [requestId, setRequestId] = useState("");
  const [volunteerId, setVolunteerId] = useState("");
  const [resourceId, setResourceId] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [message, setMessage] = useState("");
  const [records, setRecords] = useState<Assignment[]>([]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await apiFetch<{ id: string }>(SERVICE_URLS.volunteer, "/api/v1/assignments", {
        method: "POST",
        body: JSON.stringify({
          requestId,
          volunteerId: volunteerId || undefined,
          resourceId: resourceId || undefined,
          applicationId: applicationId || undefined
        })
      });
      setMessage(`Assignment created: ${response.id}`);
      const list = await apiFetch<Assignment[]>(SERVICE_URLS.volunteer, `/api/v1/assignments/${requestId}`);
      setRecords(list);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed");
    }
  };

  const fetchByRequest = async () => {
    if (!requestId) return;
    try {
      const list = await apiFetch<Assignment[]>(SERVICE_URLS.volunteer, `/api/v1/assignments/${requestId}`);
      setRecords(list);
    } catch {
      setRecords([]);
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
          <input value={applicationId} onChange={(e) => setApplicationId(e.target.value)} placeholder="Application ID (optional)" />
          <button type="submit">Assign</button>
          <button type="button" onClick={fetchByRequest}>Load Assignment History</button>
        </form>
        {message ? <p>{message}</p> : null}
      </div>
      {records.map((item) => (
        <div key={item.id} className="card">
          <p>Assignment: {item.id}</p>
          <p>Request: {item.requestId}</p>
          <p>Volunteer: {item.volunteerId ?? "-"}</p>
          <p>Resource: {item.resourceId ?? "-"}</p>
          <p>Application: {item.applicationId ?? "-"}</p>
          <p>Status: {item.status}</p>
          <p>Assigned At: {item.assignedAt}</p>
        </div>
      ))}
    </>
  );
}
