"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  PiggyBank,
  Target,
  Repeat,
} from "lucide-react";

const LINKS = [
  { href: "/financas/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/financas/transactions", label: "Lançamentos", icon: ArrowLeftRight },
  { href: "/financas/accounts", label: "Contas", icon: Wallet },
  { href: "/financas/budgets", label: "Orçamento", icon: PiggyBank },
  { href: "/financas/goals", label: "Metas", icon: Target },
  { href: "/financas/recurring", label: "Recorrências", icon: Repeat },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex h-full w-60 flex-col border-r border-slate-200 bg-white px-3 py-6">
      <Link href="/financas/dashboard" className="mb-8 px-3 text-lg font-semibold text-slate-900">
        Finanças<span className="text-indigo-600">.</span>
      </Link>

      <ul className="space-y-1">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      <Link
        href="/"
        className="mt-auto rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-600"
      >
        ← Voltar ao portfólio
      </Link>
    </nav>
  );
}
