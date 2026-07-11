import { createClient } from "@/lib/supabase/server";
import { monthRange } from "@/lib/financas/format";
import { BudgetRow } from "@/components/financas/BudgetRow";
import { NewCategoryInline } from "@/components/financas/NewCategoryInline";
import type { Budget, Category } from "@/lib/types";

export default async function BudgetsPage() {
  const { firstOfMonth } = monthRange();
  const supabase = await createClient();

  const [{ data: categories }, { data: budgets }] = await Promise.all([
    supabase.from("categories").select("*").eq("kind", "expense").order("name"),
    supabase.from("budgets").select("*").eq("month", firstOfMonth),
  ]);

  const budgetByCategory = new Map((budgets as Budget[] | null)?.map((b) => [b.category_id, b]));

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Orçamento mensal</h1>
        <p className="text-sm text-slate-400">
          Defina quanto pretende gastar em cada categoria neste mês ({firstOfMonth.slice(0, 7)}).
        </p>
      </div>

      <NewCategoryInline />

      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-2">
        {!categories || categories.length === 0 ? (
          <p className="py-4 text-sm text-slate-400">Nenhuma categoria de despesa cadastrada ainda.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {(categories as Category[]).map((category) => (
              <BudgetRow
                key={category.id}
                category={category}
                month={firstOfMonth}
                initialAmount={Number(budgetByCategory.get(category.id)?.amount ?? 0)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
