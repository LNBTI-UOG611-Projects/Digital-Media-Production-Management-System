"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export interface NavItem {
  label: string;
  href: string;
}

interface ShellProps {
  nav: NavItem[];
  roleLabel: string;
  userName: string;
  children: React.ReactNode;
}

export default function Shell({ nav, roleLabel, userName, children }: ShellProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-ivory text-charcoal md:flex">
      {open && (
        <div
          className="fixed inset-0 z-30 bg-charcoal md:hidden"
          style={{ opacity: 0.5 }}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col bg-burgundy text-ivory transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 py-6">
          <p className="font-display text-3xl tracking-widest">LOVA</p>
          <p className="mt-1 text-sm text-ivory">{roleLabel}</p>
        </div>

        <nav aria-label={`${roleLabel} navigation`} className="flex-1 overflow-y-auto px-3 pb-6">
          <ul className="space-y-1">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-md px-3 py-2 text-sm hover:bg-wine focus:outline-none focus-visible:ring-2 focus-visible:ring-ivory ${
                      active ? "bg-wine font-semibold" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-white px-4 py-3 md:px-8">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="sidebar"
            className="rounded-md border border-line px-3 py-2 text-sm text-charcoal hover:bg-ivory focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy md:hidden"
          >
            Menu
          </button>
          <p className="hidden font-display text-lg text-burgundy md:block">{roleLabel} workspace</p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted">Signed in as</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-burgundy font-semibold text-ivory" aria-hidden="true">
              {userName.charAt(0)}
            </span>
            <span className="text-sm font-semibold">{userName}</span>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
