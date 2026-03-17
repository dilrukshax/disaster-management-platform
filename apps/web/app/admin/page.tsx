"use client";

import { FormEvent, useState } from "react";
import NavBar from "../../components/NavBar";
import { apiFetch } from "../../lib/api/client";
import { SERVICE_URLS } from "../../lib/api/urls";

export default function AdminPage() {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("requester");
  const [message, setMessage] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const result = await apiFetch<{ message: string }>(SERVICE_URLS.auth, `/api/v1/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role })
      });
      setMessage(result.message);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Role update failed");
    }
  };

  return (
    <>
      <NavBar />
      <div className="card">
        <h1>Admin</h1>
        <p>Use this page for coordinator/admin operations such as role updates and operational reporting.</p>
        <form onSubmit={onSubmit}>
          <input placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="requester">requester</option>
            <option value="volunteer">volunteer</option>
            <option value="coordinator">coordinator</option>
            <option value="admin">admin</option>
          </select>
          <button type="submit">Update Role</button>
        </form>
        {message ? <p>{message}</p> : null}
      </div>
    </>
  );
}
