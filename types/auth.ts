export type UserRole = "admin" | "manager" | "staff";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

