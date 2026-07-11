import { createClient } from "@/lib/supabase/server";
import { RecurringToolbar } from "@/components/financas/RecurringToolbar";
import { RecurringRow } from "@/components/financas/RecurringRow";
import type { Account, Category, RecurringRule } from "@/lib/types";

export default async function RecurringPage() {
  const supabase = await createClient();

  const [{ data: rules }, { data: accounts }, { data: categories }] = await Promise.all([
    supabase.from("recurring_rules").select("*").order("next_run_date"),
    supabase.from("accounts").select("*").eq("archived", false).order("created_at"),
    supabase.from("categories").select("*").order("name"),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Contas recorrentes</h1>
        <RecurringToolbar accounts={(accounts ?? []) as Account[]} categories={(categories ?? []) as Category[]} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {!rules || rules.length === 0 ? (
          <p className="p-6 text-sm text-slate-400">Nenhuma conta recorrente cadastrada ainda.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {(rules as RecurringRule[]).map((rule) => (
              <RecurringRow key={rule.id} rule={rule} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
