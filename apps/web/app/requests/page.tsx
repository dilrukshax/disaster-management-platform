"use client";

import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import { apiFetch } from "../../lib/api/client";
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

  useEffect(() => {
    apiFetch<ReliefRequest[]>(SERVICE_URLS.request, "/api/v1/requests")
      .then(setRequests)
      .catch(() => setRequests([]));
  }, []);

  return (
    <>
      <NavBar />
      <h1>Requests</h1>
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
