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

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    const user = getUser<{ id: string }>();
    if (!user) return;

    apiFetch<Notification[]>(SERVICE_URLS.notification, `/api/v1/notifications/user/${user.id}`)
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  return (
    <>
      <NavBar />
      <h1>Notifications</h1>
      {items.map((item) => (
        <div className="card" key={item.id}>
          <p>{item.message}</p>
          <small>{item.createdAt}</small>
        </div>
      ))}
    </>
  );
}
