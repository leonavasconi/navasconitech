import { type NextRequest, NextResponse } from "next/server";
import { guardApp } from "@/lib/supabase/proxy";

const PROTECTED_PREFIXES = ["/financas", "/marketplace"];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const appPrefix = PROTECTED_PREFIXES.find(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );

  if (!appPrefix) {
    return NextResponse.next();
  }

  return guardApp(request, appPrefix);
}

export const config = {
  matcher: ["/financas/:path*", "/marketplace/:path*"],
};
