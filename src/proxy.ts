import { type NextRequest, NextResponse } from "next/server";
import { guardApp, guardPage } from "@/lib/supabase/proxy";

// Apps that are fully private (every page needs a session except their own
// /login and /signup, handled by guardApp).
const FULL_APP_PREFIXES = ["/financas"];

// Apps that are mostly public, with only specific pages gated behind auth.
const PARTIALLY_PROTECTED: { loginPath: string; pages: string[] }[] = [
  {
    loginPath: "/arhus/login",
    pages: ["/arhus/nova", "/arhus/minhas-ocorrencias"],
  },
  {
    loginPath: "/marketplace/login",
    pages: [
      "/marketplace/carrinho",
      "/marketplace/checkout",
      "/marketplace/meus-pedidos",
      "/marketplace/vender",
      "/marketplace/painel",
    ],
  },
];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const appPrefix = FULL_APP_PREFIXES.find(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
  if (appPrefix) {
    return guardApp(request, appPrefix);
  }

  for (const { loginPath, pages } of PARTIALLY_PROTECTED) {
    if (pages.some((page) => path === page || path.startsWith(`${page}/`))) {
      return guardPage(request, loginPath);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/financas/:path*",
    "/arhus/nova",
    "/arhus/minhas-ocorrencias",
    "/marketplace/carrinho",
    "/marketplace/carrinho/:path*",
    "/marketplace/checkout",
    "/marketplace/checkout/:path*",
    "/marketplace/meus-pedidos",
    "/marketplace/meus-pedidos/:path*",
    "/marketplace/vender",
    "/marketplace/vender/:path*",
    "/marketplace/painel",
    "/marketplace/painel/:path*",
  ],
};
