import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate, monthRange } from "@/lib/financas/format";
import { CategoryPieChart } from "@/components/financas/CategoryPieChart";
import type { Account, Budget, Category, Transaction, RecurringRule } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { start, end, firstOfMonth } = monthRange();

  const [accountsRes, monthTxRes, recentTxRes, budgetsRes, recurringRes] = await Promise.all([
    supabase.from("accounts").select("*").eq("archived", false).order("created_at"),
    supabase
      .from("transactions")
      .select("*, categories(id, name, color, icon)")
      .gte("occurred_on", start)
      .lte("occurred_on", end),
    supabase
      .from("transactions")
      .select("*, accounts(id, name, color), categories(id, name, color, icon)")
      .order("occurred_on", { ascending: false })
      .limit(8),
    supabase.from("budgets").select("*, categories(id, name, color, icon)").eq("month", firstOfMonth),
    supabase
      .from("recurring_rules")
      .select("*")
      .eq("active", true)
      .order("next_run_date")
      .limit(5),
  ]);

  const accounts = (accountsRes.data ?? []) as Account[];
  const monthTx = (monthTxRes.data ?? []) as Transaction[];
  const recentTx = (recentTxRes.data ?? []) as Transaction[];
  const budgets = (budgetsRes.data ?? []) as Budget[];
  const recurring = (recurringRes.data ?? []) as RecurringRule[];

  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.initial_balance), 0);

  const monthIncome = monthTx.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const monthExpense = monthTx.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);

  const expenseByCategory = new Map<string, { name: string; value: number; color: string }>();
  for (const tx of monthTx) {
    if (tx.type !== "expense") continue;
    const cat = tx.categories as Pick<Category, "id" | "name" | "color" | "icon"> | null;
    const key = cat?.id ?? "uncategorized";
    const existing = expenseByCategory.get(key);
    if (existing) {
      existing.value += Number(tx.amount);
    } else {
      expenseByCategory.set(key, {
        name: cat?.name ?? "Sem categoria",
        value: Number(tx.amount),
        color: cat?.color ?? "#94a3b8",
      });
    }
  }

  const budgetProgress = budgets.map((budget) => {
    const spent = expenseByCategory.get(budget.category_id)?.value ?? 0;
    const percent = budget.amount > 0 ? Math.min(100, Math.round((spent / budget.amount) * 100)) : 0;
    return { ...budget, spent, percent };
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard label="Saldo total" value={formatCurrency(totalBalance)} tone="default" />
        <SummaryCard label="Receitas do mês" value={formatCurrency(monthIncome)} tone="income" />
        <SummaryCard label="Despesas do mês" value={formatCurrency(monthExpense)} tone="expense" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-slate-900">Despesas por categoria</h2>
          <CategoryPieChart data={Array.from(expenseByCategory.values())} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Orçamento do mês</h2>
            <Link href="/financas/budgets" className="text-sm font-medium text-indigo-600 hover:underline">
              Gerenciar
            </Link>
          </div>

          {budgetProgress.length === 0 ? (
            <p className="text-sm text-slate-400">Nenhum orçamento definido para este mês ainda.</p>
          ) : (
            <div className="space-y-4">
              {budgetProgress.map((b) => (
                <div key={b.id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{b.categories?.name}</span>
                    <span className="text-slate-500">
                      {formatCurrency(b.spent)} / {formatCurrency(b.amount)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className={`h-2 rounded-full ${b.percent >= 100 ? "bg-red-500" : "bg-indigo-500"}`}
                      style={{ width: `${b.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Últimos lançamentos</h2>
            <Link href="/financas/transactions" className="text-sm font-medium text-indigo-600 hover:underline">
              Ver todos
            </Link>
          </div>

          {recentTx.length === 0 ? (
            <p className="text-sm text-slate-400">Nenhum lançamento ainda.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentTx.map((tx) => (
                <li key={tx.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium text-slate-800">{tx.description}</p>
                    <p className="text-slate-400">
                      {tx.accounts?.name} · {formatDate(tx.occurred_on)}
                    </p>
                  </div>
                  <span className={tx.type === "income" ? "font-medium text-emerald-600" : "font-medium text-red-500"}>
                    {tx.type === "income" ? "+" : "-"}
                    {formatCurrency(Number(tx.amount))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Próximas contas recorrentes</h2>
            <Link href="/financas/recurring" className="text-sm font-medium text-indigo-600 hover:underline">
              Gerenciar
            </Link>
          </div>

          {recurring.length === 0 ? (
            <p className="text-sm text-slate-400">Nenhuma conta recorrente cadastrada.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recurring.map((rule) => (
                <li key={rule.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium text-slate-800">{rule.description}</p>
                    <p className="text-slate-400">{formatDate(rule.next_run_date)}</p>
                  </div>
                  <span className={rule.type === "income" ? "font-medium text-emerald-600" : "font-medium text-red-500"}>
                    {rule.type === "income" ? "+" : "-"}
                    {formatCurrency(Number(rule.amount))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "default" | "income" | "expense";
}) {
  const toneClass =
    tone === "income" ? "text-emerald-600" : tone === "expense" ? "text-red-500" : "text-slate-900";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}
