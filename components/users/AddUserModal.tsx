"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/store/hooks";
import { createUser } from "@/store/slices/usersSlice";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import {
  userFormSchema,
  type UserFormValues,
  userRoles,
} from "@/lib/validation/userForm";

type AddUserModalProps = {
  open: boolean;
  onClose: () => void;
};

export function AddUserModal({ open, onClose }: AddUserModalProps) {
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

  async function onSubmit(values: UserFormValues) {
    try {
      await dispatch(
        createUser({
          name: values.name,
          email: values.email,
          role: values.role,
          password: values.password,
        }),
      ).unwrap();

      toast.push({
        kind: "success",
        title: "User created",
        message: `${values.name} was added.`,
      });

      reset();
      onClose();
    } catch (e) {
      const message = typeof e === "string" ? e : "Failed to create user.";
      toast.push({ kind: "error", title: "Create failed", message });
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add user"
      description="Create a new user with a role."
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1">
          <label htmlFor="user-name" className="text-sm font-medium">
            Name
          </label>
          <Input
            id="user-name"
            type="text"
            placeholder="e.g., John Doe"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="user-email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="user-email"
            type="email"
            placeholder="e.g., john@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="user-role" className="text-sm font-medium">
            Role
          </label>
          <select
            id="user-role"
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
          <label htmlFor="user-password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="user-password"
            type="password"
            placeholder="Minimum 6 characters"
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
            variant="primary"
            size="sm"
          >
            {isSubmitting ? "Saving…" : "Save user"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

