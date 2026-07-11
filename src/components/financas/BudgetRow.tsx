"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setBudget } from "@/app/financas/(app)/budgets/actions";
import { Button } from "@/components/ui/Button";
import type { Category } from "@/lib/types";

export function BudgetRow({
  category,
  month,
  initialAmount,
}: {
  category: Category;
  month: string;
  initialAmount: number;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState(initialAmount);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: category.color }} />
        <span className="text-sm font-medium text-slate-700">{category.name}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-400">R$</span>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-28 rounded-lg border border-slate-300 px-2 py-1 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
        />
        <Button
          variant="secondary"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await setBudget({ categoryId: category.id, month, amount });
              router.refresh();
            })
          }
        >
          Salvar
        </Button>
      </div>
    </div>
  );
}
