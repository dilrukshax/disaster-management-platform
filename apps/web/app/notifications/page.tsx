"use client";

import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import { apiFetch } from "../../lib/api/client";
import { getUser } from "../../lib/auth/session";
import { SERVICE_URLS } from "../../lib/api/urls";

type Notification = {
  id: string;
  message: string;
  createdAt: string;
};

type StatusEvent = {
  id: string;
  oldStatus: string;
  newStatus: string;
  changedBy: string;
  timestamp: string;
};

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [requestId, setRequestId] = useState("");
  const [events, setEvents] = useState<StatusEvent[]>([]);

  useEffect(() => {
    const user = getUser<{ id: string }>();
    if (!user) return;

    apiFetch<Notification[]>(SERVICE_URLS.notification, `/api/v1/notifications/user/${user.id}`)
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  const loadEvents = async () => {
    if (!requestId) return;
    try {
      const list = await apiFetch<StatusEvent[]>(SERVICE_URLS.notification, `/api/v1/status-events/request/${requestId}`);
      setEvents(list);
    } catch {
      setEvents([]);
    }
  };

  return (
    <>
      <NavBar />
      <h1>Notifications</h1>
      <div className="card">
        <h3>Request Status Timeline</h3>
        <input value={requestId} onChange={(e) => setRequestId(e.target.value)} placeholder="Request ID" />
        <button type="button" onClick={loadEvents}>Load Timeline</button>
      </div>
      {items.map((item) => (
        <div className="card" key={item.id}>
          <p>{item.message}</p>
          <small>{item.createdAt}</small>
        </div>
      ))}
      {events.map((item) => (
        <div className="card" key={item.id}>
          <p>{item.oldStatus} -&gt; {item.newStatus}</p>
          <p>Changed by: {item.changedBy}</p>
          <small>{item.timestamp}</small>
        </div>
      ))}
    </>
  );
}
