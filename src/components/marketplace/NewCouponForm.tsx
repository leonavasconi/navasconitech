"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createCoupon } from "@/app/marketplace/painel/actions";

export function NewCouponForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent");
  const [discountValue, setDiscountValue] = useState("10");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!code.trim()) return;
    setPending(true);
    setError(null);
    try {
      await createCoupon({ code: code.trim(), discountType, discountValue: Number(discountValue) });
      setCode("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar cupom");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Código (ex: BEMVINDO10)"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/40"
        />
        <select
          value={discountType}
          onChange={(e) => setDiscountType(e.target.value as "percent" | "fixed")}
          className="rounded-lg border border-slate-300 px-2 py-2 text-sm outline-none"
        >
          <option value="percent">%</option>
          <option value="fixed">R$</option>
        </select>
        <input
          type="number"
          value={discountValue}
          onChange={(e) => setDiscountValue(e.target.value)}
          className="w-20 rounded-lg border border-slate-300 px-2 py-2 text-sm outline-none"
        />
        <Button type="button" variant="secondary" disabled={pending} onClick={submit}>
          + Criar cupom
        </Button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
