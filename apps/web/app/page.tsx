import Link from "next/link";

export default function HomePage() {
  return (
    <section className="mx-auto mt-12 max-w-4xl rounded-3xl border border-ocean-100 bg-white/80 p-8 shadow-soft backdrop-blur sm:p-12">
      <p className="font-heading text-xs uppercase tracking-[0.2em] text-ocean-500">Disaster Management Platform</p>
      <h1 className="mt-3 font-heading text-4xl text-slate-900 sm:text-5xl">ReliefLink Access Gateway</h1>
      <p className="mt-4 max-w-2xl text-slate-600">
        Phase 1 is live with secure credential access for requesters, volunteers, and command roles. Sign in to
        enter your role workspace.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/login"
          className="rounded-xl bg-ocean-500 px-5 py-3 font-semibold text-white transition hover:bg-ocean-700"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="rounded-xl border border-ocean-200 bg-white px-5 py-3 font-semibold text-ocean-700 transition hover:border-ocean-400"
        >
          Create account
        </Link>
      </div>
    </section>
  );
}
