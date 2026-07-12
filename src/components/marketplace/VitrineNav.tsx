import Link from "next/link";
import { ShoppingCart, Store, PackageSearch } from "lucide-react";
import { SignOutButton } from "@/components/ui/SignOutButton";

export function VitrineNav({
  isLoggedIn,
  isSeller,
  cartCount,
}: {
  isLoggedIn: boolean;
  isSeller: boolean;
  cartCount: number;
}) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <Link href="/marketplace" className="flex items-center gap-2 font-semibold text-slate-900">
        <img src="/assets/img/vitrine-logo.png" alt="Vitrine" className="h-9 w-auto object-contain" />
      </Link>

      <nav className="flex items-center gap-1 text-sm font-medium">
        <Link href="/marketplace" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">
          Loja
        </Link>

        {isLoggedIn ? (
          <>
            <Link
              href="/marketplace/meus-pedidos"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100"
            >
              <PackageSearch size={16} />
              Meus pedidos
            </Link>

            <Link
              href={isSeller ? "/marketplace/painel" : "/marketplace/vender"}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100"
            >
              <Store size={16} />
              {isSeller ? "Painel do vendedor" : "Vender"}
            </Link>

            <Link
              href="/marketplace/carrinho"
              className="relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100"
            >
              <ShoppingCart size={16} />
              Carrinho
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand-600)] text-xs font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <SignOutButton redirectTo="/marketplace" />
          </>
        ) : (
          <>
            <Link
              href="/marketplace/carrinho"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100"
            >
              <ShoppingCart size={16} />
              Carrinho
            </Link>
            <Link
              href="/marketplace/login"
              className="rounded-lg bg-[var(--brand-600)] px-4 py-2 text-white hover:bg-[var(--brand-500)]"
            >
              Entrar
            </Link>
          </>
        )}

        <Link href="/" className="rounded-lg px-3 py-2 text-slate-400 hover:text-slate-600">
          ← Portfólio
        </Link>
      </nav>
    </header>
  );
}
