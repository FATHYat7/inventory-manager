import { LoginForm } from "@/components/auth/LoginForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto flex max-w-md flex-col gap-6 px-6 py-16">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-center">Sign in</h1>
          <p className="text-sm text-zinc-600">
            Use one of the predefined mock users to access the dashboard.
          </p>
        </div>

        <Suspense fallback={<div className="text-sm text-zinc-600">Loading…</div>}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}

