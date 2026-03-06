"use client";

import type { ReactNode } from "react";
import { useSession } from "next-auth/react";
import type { UserRole } from "@/types/auth";

export function RoleGate({
  allowed,
  children,
  fallback = null,
}: {
  allowed: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { data, status } = useSession();

  if (status === "loading") return null;
  const role = data?.user?.role;

  if (!role) return fallback;
  if (!allowed.includes(role)) return fallback;

  return <>{children}</>;
}

