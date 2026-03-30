"use client";

import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import { apiFetch } from "../../lib/api/client";
import { getUser } from "../../lib/auth/session";
import { subscribeMissionChannel, subscribeUserChannel } from "../../lib/realtime/socket";
import { SERVICE_URLS } from "../../lib/api/urls";

type Notification = {
  id: string;
  userId: string;
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

type SessionUser = {
  id: string;
};

type RealtimeMissionEvent = {
  requestId?: string;
};

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [requestId, setRequestId] = useState("");
  const [events, setEvents] = useState<StatusEvent[]>([]);
  const user = typeof window === "undefined" ? null : getUser<SessionUser>();

  const loadNotifications = async () => {
    if (!user) {
      setItems([]);
      return;
    }

    try {
      const list = await apiFetch<Notification[]>(SERVICE_URLS.notification, `/api/v1/notifications/user/${user.id}`);
      setItems(list);
    } catch {
      setItems([]);
    }
  };

  const loadEvents = async (currentRequestId = requestId) => {
    if (!currentRequestId) return;
    try {
      const list = await apiFetch<StatusEvent[]>(SERVICE_URLS.notification, `/api/v1/status-events/request/${currentRequestId}`);
      setEvents(list);
    } catch {
      setEvents([]);
    }
  };

  useEffect(() => {
    loadNotifications().catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (!user) {
      return;
    }

    let cleanup: (() => void) | null = null;

    subscribeUserChannel(user.id)
      .then((socket) => {
        const onNewNotification = (payload: Notification) => {
          if (!payload || payload.userId !== user.id) {
            return;
          }

          setItems((prev) => [payload, ...prev]);
        };

        const onMissionStatus = (payload: RealtimeMissionEvent) => {
          if (requestId && payload?.requestId === requestId) {
            loadEvents(payload.requestId).catch(() => undefined);
          }
        };

        socket.on("notification:new", onNewNotification);
        socket.on("mission:status-updated", onMissionStatus);

        cleanup = () => {
          socket.off("notification:new", onNewNotification);
          socket.off("mission:status-updated", onMissionStatus);
        };
      })
      .catch(() => undefined);

    return () => {
      cleanup?.();
    };
  }, [requestId, user?.id]);

  useEffect(() => {
    if (!requestId) {
      return;
    }

    subscribeMissionChannel(requestId).catch(() => undefined);
    loadEvents(requestId).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  return (
    <>
      <NavBar />
      <h1>Notifications</h1>
      <div className="card">
        <h3>Request Status Timeline</h3>
        <input value={requestId} onChange={(e) => setRequestId(e.target.value)} placeholder="Request ID" />
        <button type="button" onClick={() => loadEvents()}>Load Timeline</button>
      </div>
      {items.map((item) => (
        <div className="card" key={item.id}>
          <p>{item.message}</p>
          <small>{item.createdAt}</small>
        </div>
      ))}
      {events.map((item) => (
        <div className="card" key={item.id}>
          <p>{item.oldStatus} -&gt; {item.newStatus === "in_progress" ? "ongoing" : item.newStatus}</p>
          <p>Changed by: {item.changedBy}</p>
          <small>{item.timestamp}</small>
        </div>
      ))}
    </>
  );
}
