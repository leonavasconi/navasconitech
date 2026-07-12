"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toggleProductStatus, deleteProduct } from "@/app/marketplace/painel/actions";
import { formatCurrency } from "@/lib/financas/format";
import type { Product } from "@/lib/types";

export function SellerProductRow({ product }: { product: Product }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const cover = product.product_images?.[0]?.url;

  return (
    <li className="flex items-center gap-4 py-3">
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
        {cover && <img src={cover} alt={product.name} className="h-full w-full object-cover" />}
      </div>

      <div className="flex-1">
        <p className="text-sm font-medium text-slate-800">{product.name}</p>
        <p className="text-xs text-slate-400">
          {formatCurrency(product.price)} · {product.stock} em estoque
        </p>
      </div>

      <button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await toggleProductStatus(product.id, product.status === "active" ? "inactive" : "active");
            router.refresh();
          })
        }
        className={`rounded-full px-3 py-1 text-xs font-medium ${
          product.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
        }`}
      >
        {product.status === "active" ? "Ativo" : "Inativo"}
      </button>

      <button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            if (!confirm("Excluir este produto?")) return;
            await deleteProduct(product.id);
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
