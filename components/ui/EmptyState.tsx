import type { ReactNode } from "react";

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-10 text-center">
      <div className="text-sm font-semibold text-zinc-900">{title}</div>
      {message ? <div className="mt-1 text-sm text-zinc-600">{message}</div> : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

