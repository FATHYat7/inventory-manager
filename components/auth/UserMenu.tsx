"use client";

import { signOut, useSession } from "next-auth/react";

export function UserMenu() {
  const { data, status } = useSession();

  if (status === "loading") {
    return (
      <div className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600">
        Loading…
      </div>
    );
  }

  if (!data?.user) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="hidden rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600 sm:block">
        {data.user.name} · {data.user.role}
      </div>
      <button
        type="button"
        className="inline-flex h-9 items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        Sign out
      </button>
    </div>
  );
}

