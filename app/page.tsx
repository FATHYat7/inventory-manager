import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex items-center justify-center">
      <main className="w-full max-w-3xl space-y-8 px-6 text-center">
        
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Inventory Management System
          </h1>

          <p className="text-zinc-600 text-lg">
            Manage products, track stock levels, and monitor inventory performance.
          </p>
        </div>

        <div className="flex justify-center ">
          <Link
            href="/login"
            className="rounded-xl border bg-black text-white hover:text-black  px-8 py-4 text-lg font-medium shadow-sm hover:bg-zinc-100 transition"
          >
            Login to Dashboard
          </Link>
        </div>

      </main>
    </div>
  );
}