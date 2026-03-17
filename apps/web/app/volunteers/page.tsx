"use client";

import { FormEvent, useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import { apiFetch } from "../../lib/api/client";
import { getUser } from "../../lib/auth/session";
import { SERVICE_URLS } from "../../lib/api/urls";

type Volunteer = {
  id: string;
  userId: string;
  district: string;
  city: string;
  availabilityStatus: string;
};

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [skillSet, setSkillSet] = useState("first aid,logistics");

  const load = () => {
    apiFetch<Volunteer[]>(SERVICE_URLS.volunteer, "/api/v1/volunteers")
      .then(setVolunteers)
      .catch(() => setVolunteers([]));
  };

  useEffect(() => {
    load();
  }, []);

  const onRegister = async (e: FormEvent) => {
    e.preventDefault();
    const user = getUser<{ id: string; district?: string; city?: string }>();
    if (!user) return;

    await apiFetch(SERVICE_URLS.volunteer, "/api/v1/volunteers", {
      method: "POST",
      body: JSON.stringify({
        userId: user.id,
        skillSet: skillSet.split(",").map((s) => s.trim()),
        district: user.district ?? "Colombo",
        city: user.city ?? "Colombo",
        availabilityStatus: "available"
      })
    });

    load();
  };

  return (
    <>
      <NavBar />
      <div className="card">
        <h1>Volunteers</h1>
        <form onSubmit={onRegister}>
          <input value={skillSet} onChange={(e) => setSkillSet(e.target.value)} placeholder="Skills comma separated" />
          <button type="submit">Register as Volunteer</button>
        </form>
      </div>
      {volunteers.map((v) => (
        <div className="card" key={v.id}>
          <p>Volunteer ID: {v.id}</p>
          <p>User ID: {v.userId}</p>
          <p>
            {v.district}, {v.city}
          </p>
          <p>Status: {v.availabilityStatus}</p>
        </div>
      ))}
    </>
  );
}
