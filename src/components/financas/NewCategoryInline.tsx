"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory } from "@/lib/financas/category-actions";
import { Button } from "@/components/ui/Button";

export function NewCategoryInline() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);

  const submit = async () => {
    if (!name.trim()) return;
    setPending(true);
    try {
      await createCategory({ name: name.trim(), kind: "expense", color: "#059669" });
      setName("");
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nova categoria de despesa..."
        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
      />
      <Button type="button" variant="secondary" disabled={pending} onClick={submit}>
        + Criar
      </Button>
    </div>
  );
}
