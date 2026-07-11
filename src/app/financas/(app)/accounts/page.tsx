import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/financas/format";
import { AccountsToolbar } from "@/components/financas/AccountsToolbar";
import { ArchiveAccountButton } from "@/components/financas/ArchiveAccountButton";
import type { Account } from "@/lib/types";

const TYPE_LABELS: Record<Account["type"], string> = {
  checking: "Conta corrente",
  savings: "Poupança",
  credit_card: "Cartão de crédito",
  cash: "Dinheiro",
  investment: "Investimento",
};

export default async function AccountsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("accounts")
    .select("*")
    .eq("archived", false)
    .order("created_at");
  const accounts = (data ?? []) as Account[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Contas e cartões</h1>
        <AccountsToolbar />
      </div>

      {accounts.length === 0 ? (
        <p className="text-sm text-slate-400">Nenhuma conta cadastrada ainda.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <div key={account.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: account.color }}
                />
                <ArchiveAccountButton id={account.id} />
              </div>
              <p className="font-medium text-slate-900">{account.name}</p>
              <p className="text-sm text-slate-400">
                {TYPE_LABELS[account.type]}
                {account.institution ? ` · ${account.institution}` : ""}
              </p>
              <p className="mt-4 text-lg font-semibold text-slate-900">
                {formatCurrency(Number(account.initial_balance))}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
