"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { updateCartQuantity, removeFromCart } from "@/app/marketplace/actions";
import { formatCurrency } from "@/lib/financas/format";
import type { CartItem } from "@/lib/types";

export function CartItemRow({ item }: { item: CartItem }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const product = item.products;
  if (!product) return null;

  const cover = product.product_images?.[0]?.url;

  return (
    <li className="flex items-center gap-4 py-4">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
        {cover && <img src={cover} alt={product.name} className="h-full w-full object-cover" />}
      </div>

      <div className="flex-1">
        <p className="text-sm font-medium text-slate-800">{product.name}</p>
        <p className="text-xs text-slate-400">{formatCurrency(product.price)} cada</p>
      </div>

      <input
        type="number"
        min={1}
        max={product.stock}
        value={item.quantity}
        disabled={isPending}
        onChange={(e) =>
          startTransition(async () => {
            await updateCartQuantity(item.id, Number(e.target.value));
            router.refresh();
          })
        }
        className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-center text-sm outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/40"
      />

      <span className="w-24 text-right text-sm font-medium text-slate-800">
        {formatCurrency(product.price * item.quantity)}
      </span>

      <button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await removeFromCart(item.id);
            router.refresh();
          })
        }
        className="text-slate-300 hover:text-red-500 disabled:opacity-50"
      >
        <Trash2 size={16} />
      </button>
    </li>
  );
}
