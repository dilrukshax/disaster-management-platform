"use client";

import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import { apiFetch } from "../../lib/api/client";
import { getUser } from "../../lib/auth/session";
import { SERVICE_URLS } from "../../lib/api/urls";

export default function DashboardPage() {
  const [requestCount, setRequestCount] = useState(0);
  const [volunteerCount, setVolunteerCount] = useState(0);
  const [resourceCount, setResourceCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const user = getUser<{ id: string }>();
        const [requests, volunteers, resources, notifications] = await Promise.all([
          apiFetch<unknown[]>(SERVICE_URLS.request, "/api/v1/requests"),
          apiFetch<unknown[]>(SERVICE_URLS.volunteer, "/api/v1/volunteers"),
          apiFetch<unknown[]>(SERVICE_URLS.volunteer, "/api/v1/resources"),
          user ? apiFetch<unknown[]>(SERVICE_URLS.notification, `/api/v1/notifications/user/${user.id}`) : Promise.resolve([])
        ]);
        setRequestCount(requests.length);
        setVolunteerCount(volunteers.length);
        setResourceCount(resources.length);
        setNotificationCount(notifications.length);
      } catch {
        setRequestCount(0);
        setVolunteerCount(0);
        setResourceCount(0);
        setNotificationCount(0);
      }
    };

    load();
  }, []);

  return (
    <>
      <NavBar />
      <h1>Dashboard</h1>
      <div className="grid">
        <div className="card">
          <h2>Total Requests</h2>
          <p>{requestCount}</p>
        </div>
        <div className="card">
          <h2>Total Volunteers</h2>
          <p>{volunteerCount}</p>
        </div>
        <div className="card">
          <h2>Total Resources</h2>
          <p>{resourceCount}</p>
        </div>
        <div className="card">
          <h2>My Notifications</h2>
          <p>{notificationCount}</p>
        </div>
      </div>
    </>
  );
}
