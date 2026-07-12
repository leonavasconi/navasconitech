"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export async function addToCart(productId: string, quantity = 1) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("cart_items")
      .insert({ user_id: user.id, product_id: productId, quantity });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/marketplace/carrinho");
  revalidatePath("/marketplace", "layout");
}

export async function updateCartQuantity(cartItemId: string, quantity: number) {
  const supabase = await createClient();

  if (quantity <= 0) {
    const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", cartItemId);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/marketplace/carrinho");
  revalidatePath("/marketplace", "layout");
}

export async function removeFromCart(cartItemId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId);
  if (error) throw new Error(error.message);

  revalidatePath("/marketplace/carrinho");
  revalidatePath("/marketplace", "layout");
}

const couponSchema = z.object({ code: z.string().min(1) });

export async function validateCoupon(code: string) {
  const values = couponSchema.parse({ code });
  const supabase = await createClient();

  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("*")
    .ilike("code", values.code)
    .eq("active", true)
    .maybeSingle();

  if (error || !coupon) throw new Error("Cupom inválido ou expirado");
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    throw new Error("Cupom expirado");
  }
  if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
    throw new Error("Cupom esgotado");
  }

  return coupon;
}
