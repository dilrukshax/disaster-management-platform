"use client";

import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import { apiFetch } from "../../lib/api/client";
import { SERVICE_URLS } from "../../lib/api/urls";

export default function DashboardPage() {
  const [requestCount, setRequestCount] = useState(0);
  const [volunteerCount, setVolunteerCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [requests, volunteers] = await Promise.all([
          apiFetch<unknown[]>(SERVICE_URLS.request, "/api/v1/requests"),
          apiFetch<unknown[]>(SERVICE_URLS.volunteer, "/api/v1/volunteers")
        ]);
        setRequestCount(requests.length);
        setVolunteerCount(volunteers.length);
      } catch {
        setRequestCount(0);
        setVolunteerCount(0);
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
      </div>
    </>
  );
}
