import type { UserRole } from "@/types/auth";

export type MockUserRecord = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;
};

let mockUsers: MockUserRecord[] = [
  {
    id: "u_admin_1",
    name: "Admin User",
    email: "admin@ims.dev",
    role: "admin",
    password: "admin123",
  },
  {
    id: "u_manager_1",
    name: "Manager User",
    email: "manager@ims.dev",
    role: "manager",
    password: "manager123",
  },
  {
    id: "u_staff_1",
    name: "Staff User",
    email: "staff@ims.dev",
    role: "staff",
    password: "staff123",
  },
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function findMockUserByCredentials(input: {
  email: string;
  password: string;
}): Omit<MockUserRecord, "password"> | null {
  const match = mockUsers.find(
    (u) =>
      u.email.toLowerCase() === input.email.toLowerCase() &&
      u.password === input.password,
  );
  if (!match) return null;
  const safeUser = (({ password: _password, ...rest }) => rest)(match);
  return safeUser;
}

export type SafeUser = Omit<MockUserRecord, "password">;

export async function mockFetchUsers(): Promise<SafeUser[]> {
  await delay(300);
  return mockUsers.map(({ password: _password, ...rest }) => rest);
}

export type NewUserInput = Omit<MockUserRecord, "id">;

export async function mockCreateUser(input: NewUserInput): Promise<SafeUser> {
  await delay(300);
  const created: MockUserRecord = {
    id: `u_${Date.now()}`,
    ...input,
  };
  mockUsers = [created, ...mockUsers];
  const { password: _password, ...safeUser } = created;
  return safeUser;
}

export type UpdateUserInput = {
  id: string;
  data: Partial<NewUserInput>;
};

export async function mockUpdateUser(input: UpdateUserInput): Promise<SafeUser> {
  await delay(300);
  const index = mockUsers.findIndex((u) => u.id === input.id);
  if (index === -1) {
    throw new Error("User not found");
  }
  const updated: MockUserRecord = {
    ...mockUsers[index],
    ...input.data,
  };
  mockUsers[index] = updated;
  const { password: _password, ...safeUser } = updated;
  return safeUser;
}

export async function mockDeleteUser(id: string): Promise<string> {
  await delay(200);
  const exists = mockUsers.some((u) => u.id === id);
  if (!exists) {
    throw new Error("User not found");
  }
  mockUsers = mockUsers.filter((u) => u.id !== id);
  return id;
}

