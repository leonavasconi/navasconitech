import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/financas/format";
import { CartItemRow } from "@/components/marketplace/CartItemRow";
import { Button } from "@/components/ui/Button";
import type { CartItem } from "@/lib/types";

export default async function CartPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("cart_items")
    .select("*, products(*, sellers(id, store_name, slug), product_images(id, url, position))")
    .eq("user_id", user!.id)
    .order("created_at");

  const items = (data ?? []) as CartItem[];
  const subtotal = items.reduce((sum, item) => sum + (item.products?.price ?? 0) * item.quantity, 0);

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-xl font-semibold text-slate-900">Seu carrinho</h1>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-sm text-slate-400">Seu carrinho está vazio.</p>
          <Link
            href="/marketplace"
            className="mt-4 inline-block text-sm font-medium text-[var(--brand-600)] hover:underline"
          >
            Ver produtos
          </Link>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-slate-200 bg-white px-6">
            <ul className="divide-y divide-slate-100">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6">
            <div>
              <p className="text-sm text-slate-500">Subtotal</p>
              <p className="text-xl font-semibold text-slate-900">{formatCurrency(subtotal)}</p>
            </div>
            <Link href="/marketplace/checkout">
              <Button>Ir para o checkout</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
