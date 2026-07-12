import Link from "next/link";
import { Shield } from "lucide-react";
import { SignOutButton } from "@/components/ui/SignOutButton";

export function ArhusNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <Link href="/arhus" className="flex items-center gap-2 font-semibold text-slate-900">
        <Shield className="text-indigo-600" size={22} />
        Arhus
      </Link>

      <nav className="flex items-center gap-2 text-sm font-medium">
        <Link href="/arhus" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">
          Mapa
        </Link>

        {isLoggedIn ? (
          <>
            <Link href="/arhus/nova" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">
              Reportar
            </Link>
            <Link
              href="/arhus/minhas-ocorrencias"
              className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100"
            >
              Minhas ocorrências
            </Link>
            <SignOutButton redirectTo="/arhus" />
          </>
        ) : (
          <Link
            href="/arhus/login"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
          >
            Entrar
          </Link>
        )}

        <Link href="/" className="rounded-lg px-3 py-2 text-slate-400 hover:text-slate-600">
          ← Portfólio
        </Link>
      </nav>
    </header>
  );
}
