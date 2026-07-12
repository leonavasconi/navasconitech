"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.coerce.number().positive(),
  compareAtPrice: z.coerce.number().optional(),
  stock: z.coerce.number().int().min(0),
  categoryId: z.string().optional(),
  imageUrls: z.array(z.string()).default([]),
});

export type ProductInput = z.infer<typeof productSchema>;

async function getSellerId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { data: seller } = await supabase.from("sellers").select("id").eq("user_id", user.id).maybeSingle();
  if (!seller) throw new Error("Você ainda não tem uma loja");

  return seller.id as string;
}

export async function createProduct(input: ProductInput) {
  const values = productSchema.parse(input);
  const supabase = await createClient();
  const sellerId = await getSellerId(supabase);

  const baseSlug = slugify(values.name) || "produto";
  let slug = baseSlug;
  let suffix = 1;
  while (true) {
    const { data: existing } = await supabase.from("products").select("id").eq("slug", slug).maybeSingle();
    if (!existing) break;
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      seller_id: sellerId,
      category_id: values.categoryId || null,
      name: values.name,
      slug,
      description: values.description || "",
      price: values.price,
      compare_at_price: values.compareAtPrice || null,
      stock: values.stock,
      status: "active",
    })
    .select()
    .single();
  if (error) throw new Error(error.message);

  if (values.imageUrls.length > 0) {
    const rows = values.imageUrls.map((url, position) => ({ product_id: product.id, url, position }));
    const { error: imgError } = await supabase.from("product_images").insert(rows);
    if (imgError) throw new Error(imgError.message);
  }

  revalidatePath("/marketplace/painel");
  revalidatePath("/marketplace");
}

export async function toggleProductStatus(productId: string, status: "active" | "inactive") {
  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ status }).eq("id", productId);
  if (error) throw new Error(error.message);

  revalidatePath("/marketplace/painel");
  revalidatePath("/marketplace");
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) throw new Error(error.message);

  revalidatePath("/marketplace/painel");
  revalidatePath("/marketplace");
}

const couponCreateSchema = z.object({
  code: z.string().min(2),
  discountType: z.enum(["percent", "fixed"]),
  discountValue: z.coerce.number().positive(),
});

export async function createCoupon(input: z.infer<typeof couponCreateSchema>) {
  const values = couponCreateSchema.parse(input);
  const supabase = await createClient();
  const sellerId = await getSellerId(supabase);

  const { error } = await supabase.from("coupons").insert({
    seller_id: sellerId,
    code: values.code.toUpperCase(),
    discount_type: values.discountType,
    discount_value: values.discountValue,
  });
  if (error) {
    if (error.code === "23505") throw new Error("Esse código de cupom já está em uso. Escolha outro.");
    throw new Error(error.message);
  }

  revalidatePath("/marketplace/painel");
}
