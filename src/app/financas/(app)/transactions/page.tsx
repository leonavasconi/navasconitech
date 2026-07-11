import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/financas/format";
import { TransactionsToolbar } from "@/components/financas/TransactionsToolbar";
import { DeleteTransactionButton } from "@/components/financas/DeleteTransactionButton";
import type { Account, Category, Transaction } from "@/lib/types";

const FILTERS = [
  { value: "all", label: "Todos" },
  { value: "income", label: "Receitas" },
  { value: "expense", label: "Despesas" },
] as const;

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const activeFilter = type === "income" || type === "expense" ? type : "all";

  const supabase = await createClient();

  let query = supabase
    .from("transactions")
    .select("*, accounts(id, name, color), categories(id, name, color, icon)")
    .order("occurred_on", { ascending: false })
    .limit(100);

  if (activeFilter !== "all") {
    query = query.eq("type", activeFilter);
  }

  const [{ data: transactions }, { data: accounts }, { data: categories }] = await Promise.all([
    query,
    supabase.from("accounts").select("*").eq("archived", false).order("created_at"),
    supabase.from("categories").select("*").order("name"),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Lançamentos</h1>
        <TransactionsToolbar accounts={(accounts ?? []) as Account[]} categories={(categories ?? []) as Category[]} />
      </div>

      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "all" ? "/financas/transactions" : `/financas/transactions?type=${f.value}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              activeFilter === f.value ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {!transactions || transactions.length === 0 ? (
          <p className="p-6 text-sm text-slate-400">Nenhum lançamento encontrado.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {(transactions as Transaction[]).map((tx) => (
              <li key={tx.id} className="flex items-center justify-between px-6 py-4 text-sm">
                <div className="flex items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: tx.categories?.color ?? "#94a3b8" }}
                  />
                  <div>
                    <p className="font-medium text-slate-800">{tx.description}</p>
                    <p className="text-slate-400">
                      {tx.accounts?.name} · {tx.categories?.name ?? "Sem categoria"} · {formatDate(tx.occurred_on)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={tx.type === "income" ? "font-medium text-emerald-600" : "font-medium text-red-500"}
                  >
                    {tx.type === "income" ? "+" : "-"}
                    {formatCurrency(Number(tx.amount))}
                  </span>
                  <DeleteTransactionButton id={tx.id} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
