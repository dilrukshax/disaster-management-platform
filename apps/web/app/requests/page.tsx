"use client";

import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import { apiFetch } from "../../lib/api/client";
import { getUser } from "../../lib/auth/session";
import { SERVICE_URLS } from "../../lib/api/urls";

type ReliefRequest = {
  id: string;
  category: string;
  urgency: string;
  district: string;
  city: string;
  status: string;
};

export default function RequestsPage() {
  const [requests, setRequests] = useState<ReliefRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [requestId, setRequestId] = useState("");
  const [newStatus, setNewStatus] = useState("assigned");
  const [message, setMessage] = useState("");
  const user = typeof window === "undefined" ? null : getUser<{ role: string }>();

  const load = async () => {
    const query = new URLSearchParams();
    if (statusFilter) query.set("status", statusFilter);
    if (urgencyFilter) query.set("urgency", urgencyFilter);
    if (districtFilter) query.set("district", districtFilter);

    await apiFetch<ReliefRequest[]>(SERVICE_URLS.request, `/api/v1/requests${query.size ? `?${query.toString()}` : ""}`)
      .then(setRequests)
      .catch(() => setRequests([]));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async () => {
    setMessage("");
    try {
      await apiFetch(SERVICE_URLS.request, `/api/v1/requests/${requestId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus })
      });
      setMessage("Status updated");
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  return (
    <>
      <NavBar />
      <h1>Requests</h1>
      <div className="card">
        <h3>Filters</h3>
        <input placeholder="District" value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">pending</option>
          <option value="matched">matched</option>
          <option value="assigned">assigned</option>
          <option value="in_progress">in_progress</option>
          <option value="completed">completed</option>
          <option value="cancelled">cancelled</option>
        </select>
        <select value={urgencyFilter} onChange={(e) => setUrgencyFilter(e.target.value)}>
          <option value="">All urgencies</option>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
        <button type="button" onClick={load}>Apply Filters</button>
      </div>
      {user && ["coordinator", "admin"].includes(user.role) ? (
        <div className="card">
          <h3>Update Request Status</h3>
          <input placeholder="Request ID" value={requestId} onChange={(e) => setRequestId(e.target.value)} />
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            <option value="pending">pending</option>
            <option value="matched">matched</option>
            <option value="assigned">assigned</option>
            <option value="in_progress">in_progress</option>
            <option value="completed">completed</option>
            <option value="cancelled">cancelled</option>
          </select>
          <button type="button" onClick={updateStatus}>Update Status</button>
          {message ? <p>{message}</p> : null}
        </div>
      ) : null}
      {requests.map((item) => (
        <div className="card" key={item.id}>
          <strong>{item.category}</strong> - {item.urgency}
          <p>
            {item.district}, {item.city}
          </p>
          <p>Status: {item.status}</p>
          <p>ID: {item.id}</p>
        </div>
      ))}
    </>
  );
}
