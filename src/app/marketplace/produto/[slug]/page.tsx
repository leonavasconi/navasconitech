import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/financas/format";
import { AddToCartButton } from "@/components/marketplace/AddToCartButton";
import type { Product } from "@/lib/types";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const [{ data: product }, { data: userData }] = await Promise.all([
    supabase
      .from("products")
      .select("*, sellers(id, store_name, slug), product_categories(id, name, slug), product_images(id, url, position)")
      .eq("slug", slug)
      .eq("status", "active")
      .maybeSingle(),
    supabase.auth.getUser(),
  ]);

  if (!product) notFound();

  const item = product as Product;
  const images = (item.product_images ?? []).sort((a, b) => a.position - b.position);
  const hasDiscount = item.compare_at_price && item.compare_at_price > item.price;

  return (
    <div className="mx-auto max-w-5xl p-6">
      <Link href="/marketplace" className="text-sm text-slate-400 hover:text-slate-600">
        ← Voltar para a loja
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl bg-slate-100">
          {images[0] ? (
            <img src={images[0].url} alt={item.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-300">Sem foto</div>
          )}
        </div>

        <div>
          <Link
            href={`/marketplace/loja/${item.sellers?.slug}`}
            className="text-sm font-medium text-[var(--brand-600)] hover:underline"
          >
            {item.sellers?.store_name}
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">{item.name}</h1>

          {item.product_categories && (
            <p className="mt-1 text-xs text-slate-400">{item.product_categories.name}</p>
          )}

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-semibold text-slate-900">{formatCurrency(item.price)}</span>
            {hasDiscount && (
              <span className="text-sm text-slate-400 line-through">
                {formatCurrency(item.compare_at_price!)}
              </span>
            )}
          </div>

          <p className="mt-2 text-xs text-slate-400">
            {item.stock > 0 ? `${item.stock} em estoque` : "Sem estoque"}
          </p>

          <p className="mt-6 whitespace-pre-line text-sm text-slate-600">{item.description}</p>

          <div className="mt-6">
            <AddToCartButton productId={item.id} stock={item.stock} isLoggedIn={!!userData?.user} />
          </div>
        </div>
      </div>
    </div>
  );
}
