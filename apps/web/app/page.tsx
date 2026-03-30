import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <div className="card">
        <h1>ReliefLink Mission Control</h1>
        <p>
          Sri Lanka disaster mission platform for realtime rescue tracking, volunteer approvals,
          and coordinated field response.
        </p>
        <div className="inline-actions">
          <Link href="/requests">Open Mission Map</Link>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </div>
      </div>

      <div className="card">
        <h2 className="section-title">Live Mission Loading Board</h2>
        <p>System checks before mission operations:</p>
        <p className="status-pill pending">Request intake active</p>
        <p className="status-pill assigned">Admin dispatch active</p>
        <p className="status-pill in_progress">Ongoing rescue tracking active</p>
        <p className="status-pill completed">Notification stream active</p>
      </div>
    </>
  );
}
