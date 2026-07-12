import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/financas/format";
import { SimulatePaymentButton } from "@/components/marketplace/SimulatePaymentButton";
import type { Order, OrderItem, ShippingAddress } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Aguardando pagamento",
  paid: "Pago",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const PROVIDER_LABELS: Record<string, string> = {
  pix: "Pix",
  mercado_pago: "Mercado Pago",
  stripe: "Cartão (Stripe)",
};

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: order }, { data: items }] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).maybeSingle(),
    supabase.from("order_items").select("*").eq("order_id", id),
  ]);

  if (!order) notFound();

  const orderData = order as Order;
  const address = orderData.shipping_address as ShippingAddress;
  const orderItems = (items ?? []) as OrderItem[];

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
        {orderData.status === "paid" ? (
          <CheckCircle2 className="mx-auto mb-2 text-emerald-500" size={40} />
        ) : (
          <Clock className="mx-auto mb-2 text-amber-500" size={40} />
        )}
        <h1 className="text-xl font-semibold text-slate-900">Pedido #{orderData.id.slice(0, 8)}</h1>
        <p className="mt-1 text-sm text-slate-500">{STATUS_LABELS[orderData.status]}</p>
        <p className="text-xs text-slate-400">{formatDate(orderData.created_at.slice(0, 10))}</p>

        {orderData.status === "pending_payment" && (
          <div className="mt-4 space-y-2">
            <p className="text-xs text-slate-400">
              Pagamento via {PROVIDER_LABELS[orderData.payment_provider ?? "pix"]} (ambiente sandbox — nenhuma
              cobrança real).
            </p>
            <SimulatePaymentButton orderId={orderData.id} />
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-3 font-semibold text-slate-900">Itens</h2>
        <ul className="divide-y divide-slate-100">
          {orderItems.map((item) => (
            <li key={item.id} className="flex justify-between py-2 text-sm">
              <span>
                {item.quantity}x {item.product_name}
              </span>
              <span className="font-medium">{formatCurrency(item.subtotal)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-1 border-t border-slate-100 pt-4 text-sm">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span>{formatCurrency(orderData.subtotal)}</span>
          </div>
          {orderData.discount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Desconto</span>
              <span>-{formatCurrency(orderData.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-500">
            <span>Frete</span>
            <span>{formatCurrency(orderData.shipping_cost)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-1 font-semibold text-slate-900">
            <span>Total</span>
            <span>{formatCurrency(orderData.total)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-2 font-semibold text-slate-900">Endereço de entrega</h2>
        <p className="text-sm text-slate-600">
          {address.name} · {address.phone}
          <br />
          {address.street}, {address.number}
          {address.complement ? ` — ${address.complement}` : ""}
          <br />
          {address.neighborhood}, {address.city} - {address.state}
          <br />
          CEP {address.zip}
        </p>
      </div>

      <Link href="/marketplace/meus-pedidos" className="block text-center text-sm text-[var(--brand-600)] hover:underline">
        Ver todos os meus pedidos
      </Link>
    </div>
  );
}
