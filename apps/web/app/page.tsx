import Link from "next/link";

export default function HomePage() {
  return (
    <div className="card">
      <h1>ReliefLink Portal</h1>
      <p>Disaster relief request coordination system.</p>
      <div className="nav">
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
        <Link href="/dashboard">Dashboard</Link>
      </div>
    </div>
  );
}
