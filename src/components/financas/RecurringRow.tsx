"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { postRecurringNow, toggleRecurringActive } from "@/app/financas/(app)/recurring/actions";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/lib/financas/format";
import type { RecurringRule } from "@/lib/types";

const FREQUENCY_LABELS: Record<RecurringRule["frequency"], string> = {
  weekly: "Semanal",
  monthly: "Mensal",
  yearly: "Anual",
};

export function RecurringRow({ rule }: { rule: RecurringRule }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between px-6 py-4 text-sm">
      <div>
        <p className="font-medium text-slate-800">{rule.description}</p>
        <p className="text-slate-400">
          {FREQUENCY_LABELS[rule.frequency]} · Próxima: {formatDate(rule.next_run_date)}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <span className={rule.type === "income" ? "font-medium text-emerald-600" : "font-medium text-red-500"}>
          {rule.type === "income" ? "+" : "-"}
          {formatCurrency(Number(rule.amount))}
        </span>

        <Button
          variant="secondary"
          disabled={isPending || !rule.active}
          onClick={() =>
            startTransition(async () => {
              await postRecurringNow(rule.id);
              router.refresh();
            })
          }
        >
          Lançar agora
        </Button>

        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await toggleRecurringActive(rule.id, !rule.active);
              router.refresh();
            })
          }
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            rule.active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
          }`}
        >
          {rule.active ? "Ativa" : "Pausada"}
        </button>
      </div>
    </div>
  );
}
