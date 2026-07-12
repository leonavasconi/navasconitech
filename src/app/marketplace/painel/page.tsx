import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/financas/format";
import { SellerProductRow } from "@/components/marketplace/SellerProductRow";
import { NewCouponForm } from "@/components/marketplace/NewCouponForm";
import { Button } from "@/components/ui/Button";
import type { Coupon, OrderItem, Product, Seller } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Aguardando pagamento",
  paid: "Pago",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

export default async function SellerDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: sellerData } = await supabase.from("sellers").select("*").eq("user_id", user!.id).maybeSingle();
  if (!sellerData) redirect("/marketplace/vender");
  const seller = sellerData as Seller;

  const [{ data: products }, { data: orderItems }, { data: coupons }] = await Promise.all([
    supabase
      .from("products")
      .select("*, product_images(id, url, position)")
      .eq("seller_id", seller.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("order_items")
      .select("*, orders(id, status, created_at)")
      .eq("seller_id", seller.id)
      .order("id", { ascending: false })
      .limit(20),
    supabase.from("coupons").select("*").eq("seller_id", seller.id).order("created_at", { ascending: false }),
  ]);

  const items = ((products ?? []) as Product[]).map((p) => ({
    ...p,
    product_images: (p.product_images ?? []).sort((a, b) => a.position - b.position),
  }));
  const orders = (orderItems ?? []) as OrderItem[];
  const sellerCoupons = (coupons ?? []) as Coupon[];

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{seller.store_name}</h1>
          <Link
            href={`/marketplace/loja/${seller.slug}`}
            className="text-sm text-[var(--brand-600)] hover:underline"
          >
            Ver minha loja pública
          </Link>
        </div>
        <Link href="/marketplace/painel/produtos/novo">
          <Button>+ Novo produto</Button>
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-3 font-semibold text-slate-900">Meus produtos</h2>
        {items.length === 0 ? (
          <p className="text-sm text-slate-400">Você ainda não cadastrou nenhum produto.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((product) => (
              <SellerProductRow key={product.id} product={product} />
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-3 font-semibold text-slate-900">Pedidos recebidos</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-slate-400">Nenhum pedido recebido ainda.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {orders.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-slate-800">
                    {item.quantity}x {item.product_name}
                  </p>
                  <p className="text-slate-400">
                    {item.orders && formatDate(item.orders.created_at.slice(0, 10))} ·{" "}
                    {item.orders ? STATUS_LABELS[item.orders.status] : ""}
                  </p>
                </div>
                <span className="font-medium text-slate-900">{formatCurrency(item.subtotal)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-3 font-semibold text-slate-900">Cupons</h2>
        <NewCouponForm />
        {sellerCoupons.length > 0 && (
          <ul className="mt-4 divide-y divide-slate-100">
            {sellerCoupons.map((coupon) => (
              <li key={coupon.id} className="flex items-center justify-between py-2 text-sm">
                <span className="font-medium text-slate-800">{coupon.code}</span>
                <span className="text-slate-500">
                  {coupon.discount_type === "percent"
                    ? `${coupon.discount_value}%`
                    : formatCurrency(coupon.discount_value)}{" "}
                  · usado {coupon.used_count}x
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
