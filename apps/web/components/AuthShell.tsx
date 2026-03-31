import type { ReactNode } from "react";
import Link from "next/link";

export function AuthShell({
  title,
  subtitle,
  children,
  alternateLink
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  alternateLink: { href: string; label: string };
}) {
  return (
    <div className="relative mx-auto mt-14 w-full max-w-xl overflow-hidden rounded-3xl border border-ocean-100 bg-white/85 p-8 shadow-soft backdrop-blur">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-b from-ocean-200 to-transparent" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gradient-to-r from-amber-200/55 to-emerald-200/50" />
      <div className="relative">
        <p className="font-heading text-xs uppercase tracking-[0.2em] text-ocean-500">ReliefLink Command Access</p>
        <h1 className="mt-2 font-heading text-3xl text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
        <div className="mt-6">{children}</div>
        <p className="mt-6 text-sm text-slate-600">
          <Link className="font-semibold text-ocean-700 underline decoration-ocean-300 underline-offset-4" href={alternateLink.href}>
            {alternateLink.label}
          </Link>
        </p>
      </div>
    </div>
  );
}
