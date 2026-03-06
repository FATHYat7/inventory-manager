"use client";

import { useState } from "react";
import { AddUserModal } from "@/components/users/AddUserModal";
import { EditUserModal } from "@/components/users/EditUserModal";
import { UsersTable } from "@/components/users/UsersTable";
import type { User } from "@/types/auth";
import { useAppDispatch } from "@/store/hooks";
import { deleteUser } from "@/store/slices/usersSlice";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/Toast";

export function UsersPageClient() {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { data } = useSession();
  const role = data?.user?.role;
  const canManage = role === "admin";
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  async function handleDelete(user: User) {
    if (!canManage) return;
    const confirmed = window.confirm(
      `Delete user "${user.name}"? This action cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      await dispatch(deleteUser(user.id)).unwrap();
      toast.push({
        kind: "success",
        title: "User deleted",
        message: `${user.name} was removed.`,
      });
    } catch (e) {
      const message = typeof e === "string" ? e : "Failed to delete user.";
      toast.push({ kind: "error", title: "Delete failed", message });
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
            <p className="text-sm text-zinc-600">
              Manage user accounts and permissions.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            disabled={!canManage}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add user
          </button>
        </div>

        <UsersTable
          onEdit={(user) => setEditingUser(user)}
          onDelete={handleDelete}
          canManage={canManage}
        />
      </div>

      <AddUserModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
      <EditUserModal
        open={Boolean(editingUser)}
        user={editingUser}
        onClose={() => setEditingUser(null)}
      />
    </>
  );
}

