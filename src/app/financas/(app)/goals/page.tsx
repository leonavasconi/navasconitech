import { createClient } from "@/lib/supabase/server";
import { GoalsToolbar } from "@/components/financas/GoalsToolbar";
import { GoalCard } from "@/components/financas/GoalCard";
import type { Goal } from "@/lib/types";

export default async function GoalsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("goals")
    .select("*")
    .eq("archived", false)
    .order("created_at");
  const goals = (data ?? []) as Goal[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Metas de economia</h1>
        <GoalsToolbar />
      </div>

      {goals.length === 0 ? (
        <p className="text-sm text-slate-400">Nenhuma meta cadastrada ainda.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  );
}
