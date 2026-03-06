import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { appPaths } from "@/lib/paths";

const protectedPrefixes = ["/dashboard", "/products", "/users"] as const;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req });

  if (pathname === appPaths.login) {
    if (token) {
      const url = req.nextUrl.clone();
      url.pathname = appPaths.dashboard;
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const isProtected = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (isProtected && !token) {
    const url = req.nextUrl.clone();
    url.pathname = appPaths.login;
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/products/:path*",
    "/users/:path*",
  ],
};

