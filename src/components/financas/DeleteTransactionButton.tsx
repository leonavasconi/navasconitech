"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteTransaction } from "@/app/financas/(app)/transactions/actions";

export function DeleteTransactionButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          if (!confirm("Excluir este lançamento?")) return;
          await deleteTransaction(id);
          router.refresh();
        })
      }
      className="text-slate-300 hover:text-red-500 disabled:opacity-50"
    >
      <Trash2 size={16} />
    </button>
  );
}
