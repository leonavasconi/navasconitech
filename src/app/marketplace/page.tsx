import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/marketplace/ProductCard";
import type { MarketplaceCategory, Product } from "@/lib/types";

export default async function MarketplaceHomePage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; busca?: string }>;
}) {
  const { categoria, busca } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*, sellers(id, store_name, slug), product_categories(id, name, slug), product_images(id, url, position)")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (categoria) {
    const { data: cat } = await supabase.from("product_categories").select("id").eq("slug", categoria).maybeSingle();
    if (cat) query = query.eq("category_id", cat.id);
  }

  if (busca) {
    query = query.ilike("name", `%${busca}%`);
  }

  const [{ data: products }, { data: categories }] = await Promise.all([
    query,
    supabase.from("product_categories").select("*").order("name"),
  ]);

  const items = ((products ?? []) as Product[]).map((p) => ({
    ...p,
    product_images: (p.product_images ?? []).sort((a, b) => a.position - b.position),
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="rounded-2xl bg-gradient-to-r from-[var(--brand-600)] to-fuchsia-500 p-8 text-white">
        <h1 className="text-2xl font-semibold">Compre. Venda. Conecte.</h1>
        <p className="mt-1 text-sm text-white/80">
          Um marketplace com várias lojas em um só lugar.{" "}
          <Link href="/marketplace/vender" className="underline">
            Quer vender aqui?
          </Link>
        </p>
      </div>

      <form className="flex gap-2">
        <input
          type="text"
          name="busca"
          defaultValue={busca}
          placeholder="Buscar produtos..."
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/40"
        />
        <button
          type="submit"
          className="rounded-lg bg-[var(--brand-600)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--brand-500)]"
        >
          Buscar
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/marketplace"
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            !categoria ? "bg-[var(--brand-600)] text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          Todas as categorias
        </Link>
        {((categories ?? []) as MarketplaceCategory[]).map((cat) => (
          <Link
            key={cat.id}
            href={`/marketplace?categoria=${cat.slug}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              categoria === cat.slug ? "bg-[var(--brand-600)] text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="py-16 text-center text-sm text-slate-400">Nenhum produto encontrado.</p>
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
