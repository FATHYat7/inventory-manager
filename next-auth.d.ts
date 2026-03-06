import type { DefaultSession } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";
import type { UserRole } from "@/types/auth";

declare module "next-auth" {
  interface User {
    role: UserRole;
  }

  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: UserRole;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    role?: UserRole;
  }
}

