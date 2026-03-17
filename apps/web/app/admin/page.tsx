"use client";

import NavBar from "../../components/NavBar";

export default function AdminPage() {
  return (
    <>
      <NavBar />
      <div className="card">
        <h1>Admin</h1>
        <p>Use this page for coordinator/admin operations such as role updates and operational reporting.</p>
      </div>
    </>
  );
}
