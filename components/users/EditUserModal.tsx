"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/store/hooks";
import { updateUser } from "@/store/slices/usersSlice";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import {
  userFormSchema,
  type UserFormValues,
  userRoles,
} from "@/lib/validation/userForm";
import type { User } from "@/types/auth";

type EditUserModalProps = {
  open: boolean;
  user: User | null;
  onClose: () => void;
};

export function EditUserModal({ open, user, onClose }: EditUserModalProps) {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "staff",
      password: "",
    },
  });

  useEffect(() => {
    if (user && open) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
        password: "",
      });
    }
  }, [user, open, reset]);

  async function onSubmit(values: UserFormValues) {
    if (!user) return;

    try {
      await dispatch(
        updateUser({
          id: user.id,
          data: {
            name: values.name,
            email: values.email,
            role: values.role,
            ...(values.password && { password: values.password }),
          },
        }),
      ).unwrap();

      toast.push({
        kind: "success",
        title: "User updated",
        message: `${values.name} was saved.`,
      });

      onClose();
    } catch (e) {
      const message = typeof e === "string" ? e : "Failed to update user.";
      toast.push({ kind: "error", title: "Update failed", message });
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit user"
      description={user ? `Update details for ${user.name}.` : undefined}
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1">
          <label htmlFor="edit-user-name" className="text-sm font-medium">
            Name
          </label>
          <Input
            id="edit-user-name"
            type="text"
            placeholder="e.g., John Doe"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="edit-user-email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="edit-user-email"
            type="email"
            placeholder="e.g., john@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="edit-user-role" className="text-sm font-medium">
            Role
          </label>
          <select
            id="edit-user-role"
            className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-400"
            {...register("role")}
          >
            {userRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="text-xs text-red-600">{errors.role.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="edit-user-password" className="text-sm font-medium">
            Password <span className="text-zinc-400">(optional)</span>
          </label>
          <Input
            id="edit-user-password"
            type="password"
            placeholder="Leave blank to keep current"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            onClick={onClose}
            size="sm"
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            size="sm"
            variant="primary"
          >
            {isSubmitting ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

