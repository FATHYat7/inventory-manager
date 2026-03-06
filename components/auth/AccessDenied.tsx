import Link from "next/link";
import { appPaths } from "@/lib/paths";

export function AccessDenied({
  title = "Access denied",
  message = "You don’t have permission to view this page.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="text-lg font-semibold tracking-tight">{title}</div>
      <div className="mt-1 text-sm text-zinc-600">{message}</div>
      <div className="mt-4">
        <Link
          href={appPaths.dashboard}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}

