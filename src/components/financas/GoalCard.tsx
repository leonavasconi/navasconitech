"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addContribution } from "@/app/financas/(app)/goals/actions";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/lib/financas/format";
import type { Goal } from "@/lib/types";

export function GoalCard({ goal }: { goal: Goal }) {
  const router = useRouter();
  const [amount, setAmount] = useState(0);
  const [isPending, startTransition] = useTransition();

  const percent = goal.target_amount > 0
    ? Math.min(100, Math.round((Number(goal.current_amount) / Number(goal.target_amount)) * 100))
    : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-medium text-slate-900">{goal.name}</p>
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: goal.color }} />
      </div>

      <p className="text-sm text-slate-500">
        {formatCurrency(Number(goal.current_amount))} de {formatCurrency(Number(goal.target_amount))}
      </p>
      {goal.target_date && <p className="text-xs text-slate-400">Meta para {formatDate(goal.target_date)}</p>}

      <div className="my-3 h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full" style={{ width: `${percent}%`, backgroundColor: goal.color }} />
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          step="0.01"
          value={amount || ""}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Valor"
          className="w-24 rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
        />
        <Button
          variant="secondary"
          disabled={isPending || !amount}
          onClick={() =>
            startTransition(async () => {
              await addContribution({ goalId: goal.id, amount });
              setAmount(0);
              router.refresh();
            })
          }
        >
          Depositar
        </Button>
      </div>
    </div>
  );
}
