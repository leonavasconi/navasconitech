"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { PaymentProvider } from "@/lib/types";

const SHIPPING_FLAT_RATE = 19.9;

const addressSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  street: z.string().min(1),
  number: z.string().min(1),
  complement: z.string().optional(),
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
});

const checkoutSchema = z.object({
  address: addressSchema,
  couponCode: z.string().optional(),
  paymentProvider: z.enum(["mercado_pago", "stripe", "pix"]),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export async function createOrder(input: CheckoutInput) {
  const values = checkoutSchema.parse(input);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { data: cartItems, error: cartError } = await supabase
    .from("cart_items")
    .select("id, quantity, products(id, name, price, stock, seller_id)")
    .eq("user_id", user.id);
  if (cartError) throw new Error(cartError.message);
  if (!cartItems || cartItems.length === 0) throw new Error("Seu carrinho está vazio");

  for (const item of cartItems) {
    const product = item.products as unknown as { name: string; stock: number } | null;
    if (!product) throw new Error("Um dos produtos do carrinho não existe mais");
    if (item.quantity > product.stock) {
      throw new Error(`Estoque insuficiente para "${product.name}"`);
    }
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const product = item.products as unknown as { price: number } | null;
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);

  let discount = 0;
  let couponId: string | null = null;

  if (values.couponCode) {
    const { data: coupon } = await supabase
      .from("coupons")
      .select("*")
      .ilike("code", values.couponCode)
      .eq("active", true)
      .maybeSingle();

    if (coupon && (!coupon.expires_at || new Date(coupon.expires_at) >= new Date())) {
      if (coupon.max_uses === null || coupon.used_count < coupon.max_uses) {
        discount =
          coupon.discount_type === "percent"
            ? (subtotal * coupon.discount_value) / 100
            : Math.min(coupon.discount_value, subtotal);
        couponId = coupon.id;
      }
    }
  }

  const shippingCost = SHIPPING_FLAT_RATE;
  const total = Math.max(0, subtotal - discount) + shippingCost;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      buyer_id: user.id,
      status: "pending_payment",
      subtotal,
      discount,
      shipping_cost: shippingCost,
      total,
      coupon_id: couponId,
      shipping_address: values.address,
      payment_provider: values.paymentProvider as PaymentProvider,
      payment_status: "pending",
    })
    .select()
    .single();
  if (orderError) throw new Error(orderError.message);

  const orderItems = cartItems.map((item) => {
    const product = item.products as unknown as {
      id: string;
      name: string;
      price: number;
      seller_id: string;
    };
    return {
      order_id: order.id,
      product_id: product.id,
      seller_id: product.seller_id,
      product_name: product.name,
      unit_price: product.price,
      quantity: item.quantity,
      subtotal: product.price * item.quantity,
    };
  });

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) throw new Error(itemsError.message);

  for (const item of cartItems) {
    const product = item.products as unknown as { id: string };
    const { error: stockError } = await supabase.rpc("decrement_product_stock", {
      p_product_id: product.id,
      p_quantity: item.quantity,
    });
    if (stockError) throw new Error(stockError.message);
  }

  if (couponId) {
    const { error: couponError } = await supabase.rpc("increment_coupon_usage", { p_coupon_id: couponId });
    if (couponError) throw new Error(couponError.message);
  }

  await supabase.from("cart_items").delete().eq("user_id", user.id);

  return { orderId: order.id as string };
}

export async function simulatePayment(orderId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status: "paid", payment_status: "paid" })
    .eq("id", orderId);
  if (error) throw new Error(error.message);
}
