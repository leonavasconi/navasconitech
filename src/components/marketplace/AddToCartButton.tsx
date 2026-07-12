"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { addToCart } from "@/app/marketplace/actions";

export function AddToCartButton({
  productId,
  stock,
  isLoggedIn,
}: {
  productId: string;
  stock: number;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  if (stock <= 0) {
    return (
      <Button disabled variant="secondary">
        Fora de estoque
      </Button>
    );
  }

  if (!isLoggedIn) {
    return (
      <Link
        href="/marketplace/login"
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-600)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--brand-500)]"
      >
        Entrar para comprar
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <input
        type="number"
        min={1}
        max={stock}
        value={quantity}
        onChange={(e) => setQuantity(Math.max(1, Math.min(stock, Number(e.target.value))))}
        className="w-16 rounded-lg border border-slate-300 px-2 py-2 text-center text-sm outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/40"
      />
      <Button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await addToCart(productId, quantity);
            setAdded(true);
            router.refresh();
          })
        }
      >
        {isPending ? "Adicionando..." : added ? "Adicionado ✓" : "Adicionar ao carrinho"}
      </Button>
    </div>
  );
}
