import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/marketplace/ProductCard";
import type { Product, Seller } from "@/lib/types";

export default async function SellerStorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: seller } = await supabase
    .from("sellers")
    .select("*")
    .eq("slug", slug)
    .eq("status", "approved")
    .maybeSingle();

  if (!seller) notFound();

  const store = seller as Seller;

  const { data: products } = await supabase
    .from("products")
    .select("*, sellers(id, store_name, slug), product_categories(id, name, slug), product_images(id, url, position)")
    .eq("seller_id", store.id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const items = ((products ?? []) as Product[]).map((p) => ({
    ...p,
    product_images: (p.product_images ?? []).sort((a, b) => a.position - b.position),
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        {store.logo_url && (
          <img src={store.logo_url} alt={store.store_name} className="mb-3 h-16 w-16 rounded-full object-cover" />
        )}
        <h1 className="text-xl font-semibold text-slate-900">{store.store_name}</h1>
        {store.description && <p className="mt-1 text-sm text-slate-500">{store.description}</p>}
      </div>

      {items.length === 0 ? (
        <p className="py-16 text-center text-sm text-slate-400">Essa loja ainda não tem produtos.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
