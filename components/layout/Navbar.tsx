import Link from "next/link";
import { UserMenu } from "@/components/auth/UserMenu";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold tracking-tight text-zinc-900 hover:bg-zinc-100"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-900 text-[10px] font-bold uppercase text-zinc-50">
              IM
            </span>
            <span className="hidden sm:inline">Inventory Manager</span>
          </Link>
         
        </div>

        <div className="flex items-center gap-2">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

