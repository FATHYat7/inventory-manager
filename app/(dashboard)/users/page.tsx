import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AccessDenied } from "@/components/auth/AccessDenied";
import { UsersPageClient } from "@/components/users/UsersPageClient";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  if (role !== "admin") {
    return (
      <div className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
          <p className="text-sm text-zinc-600">Admin-only section.</p>
        </div>
        <AccessDenied message="Only admins can manage users." />
      </div>
    );
  }

  return <UsersPageClient />;
}

