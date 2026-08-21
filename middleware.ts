import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";

// Node runtime because verifySession uses Node's crypto module (HMAC signing).
export const runtime = "nodejs";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get("admin_session")?.value;
  if (!verifySession(token)) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
