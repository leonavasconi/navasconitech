import Link from "next/link";
import { formatCurrency } from "@/lib/financas/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const cover = product.product_images?.[0]?.url;
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;

  return (
    <Link
      href={`/marketplace/produto/${product.slug}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-md"
    >
      <div className="aspect-square w-full overflow-hidden bg-slate-100">
        {cover ? (
          <img
            src={cover}
            alt={product.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">Sem foto</div>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs text-slate-400">{product.sellers?.store_name}</p>
        <p className="mt-0.5 line-clamp-2 text-sm font-medium text-slate-800">{product.name}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-semibold text-slate-900">{formatCurrency(product.price)}</span>
          {hasDiscount && (
            <span className="text-xs text-slate-400 line-through">
              {formatCurrency(product.compare_at_price!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
