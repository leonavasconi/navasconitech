import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CheckoutForm } from "@/components/marketplace/CheckoutForm";

export default async function CheckoutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: cartItems } = await supabase
    .from("cart_items")
    .select("quantity, products(price)")
    .eq("user_id", user!.id);

  if (!cartItems || cartItems.length === 0) {
    redirect("/marketplace/carrinho");
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const product = item.products as unknown as { price: number } | null;
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Finalizar compra</h1>
      <CheckoutForm subtotal={subtotal} />
    </div>
  );
}
