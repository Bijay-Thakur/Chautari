import { NextRequest, NextResponse } from "next/server";
import { SAATHI_AUTH_COOKIE, SAATHI_AUTH_VALUE } from "@/constants/auth";

const PROTECTED_PREFIXES = [
  "/home",
  "/chautari",
  "/screening",
  "/break-the-chain",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookie = req.cookies.get(SAATHI_AUTH_COOKIE)?.value;
  const authed = cookie === SAATHI_AUTH_VALUE;

  // Landing: authenticated users skip straight to /home
  if (pathname === "/") {
    if (authed) {
      return NextResponse.redirect(new URL("/home", req.url));
    }
    return NextResponse.next();
  }

  // Protected routes: unauthenticated users go back to login
  if (PROTECTED_PREFIXES.some((p) => pathname.startsWith(p)) && !authed) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/home/:path*",
    "/chautari/:path*",
    "/screening/:path*",
    "/break-the-chain/:path*",
  ],
};
