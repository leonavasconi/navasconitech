import { type NextRequest, NextResponse } from "next/server";
import { guardApp, guardPage } from "@/lib/supabase/proxy";

const FULL_APP_PREFIXES = ["/financas", "/marketplace"];
const ARHUS_PROTECTED_PAGES = ["/arhus/nova", "/arhus/minhas-ocorrencias"];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const appPrefix = FULL_APP_PREFIXES.find(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
  if (appPrefix) {
    return guardApp(request, appPrefix);
  }

  if (ARHUS_PROTECTED_PAGES.some((page) => path === page || path.startsWith(`${page}/`))) {
    return guardPage(request, "/arhus/login");
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/financas/:path*",
    "/marketplace/:path*",
    "/arhus/nova",
    "/arhus/minhas-ocorrencias",
  ],
};
