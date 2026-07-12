import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/financas/format";
import type { Order } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Aguardando pagamento",
  paid: "Pago",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const STATUS_COLORS: Record<string, string> = {
  pending_payment: "bg-amber-50 text-amber-600",
  paid: "bg-emerald-50 text-emerald-600",
  shipped: "bg-blue-50 text-blue-600",
  delivered: "bg-slate-100 text-slate-600",
  cancelled: "bg-red-50 text-red-600",
};

export default async function MyOrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("buyer_id", user!.id)
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as Order[];

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-xl font-semibold text-slate-900">Meus pedidos</h1>

      {orders.length === 0 ? (
        <p className="text-sm text-slate-400">Você ainda não fez nenhum pedido.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <ul className="divide-y divide-slate-100">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/marketplace/pedido/${order.id}`}
                  className="flex items-center justify-between px-6 py-4 text-sm hover:bg-slate-50"
                >
                  <div>
                    <p className="font-medium text-slate-800">Pedido #{order.id.slice(0, 8)}</p>
                    <p className="text-slate-400">{formatDate(order.created_at.slice(0, 10))}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                    {STATUS_LABELS[order.status]}
                  </span>
                  <span className="font-medium text-slate-900">{formatCurrency(order.total)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
