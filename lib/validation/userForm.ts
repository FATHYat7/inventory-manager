import { z } from "zod";
import type { UserRole } from "@/types/auth";

export const userFormSchema = z.object({
  name: z.string().min(1, "Name is required.").max(100, "Name must be less than 100 characters."),
  email: z.string().email("Invalid email address."),
  role: z.enum(["admin", "manager", "staff"] as const, {
    message: "Please select a role.",
  }),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export const userRoles: { id: UserRole; name: string }[] = [
  { id: "admin", name: "Admin" },
  { id: "manager", name: "Manager" },
  { id: "staff", name: "Staff" },
];

