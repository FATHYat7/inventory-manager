"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { RoleGate } from "@/components/auth/RoleGate";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
];

export function Sidebar() {
  const { data } = useSession();
  const role = data?.user?.role;
  const pathname = usePathname();

  const isActiveLink = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="rounded-2xl border border-zinc-200 bg-white p-3">
      <div className="px-3 pb-2 pt-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
        Navigation
      </div>
      <div className="flex flex-col">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`mb-1 rounded-xl px-3 py-2 text-sm transition-colors ${
              isActiveLink(item.href)
                ? "bg-zinc-900 text-zinc-50"
                : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
            }`}
          >
            {item.label}
          </Link>
        ))}

        
        <RoleGate allowed={["admin"]}>
          <Link
            href="/users"
            className={`mb-1 rounded-xl px-3 py-2 text-sm transition-colors ${
              isActiveLink("/users")
                ? "bg-zinc-900 text-zinc-50"
                : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
            }`}
          >
            Users (admin)
          </Link>

        
          <Link
            href="/reports"
            className={`mb-1 rounded-xl px-3 py-2 text-sm transition-colors ${
              isActiveLink("/dashboard/reports")
                ? "bg-zinc-900 text-zinc-50"
                : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
            }`}
          >
            Reports
          </Link>
        </RoleGate>
      </div>
    </nav>
  );
}