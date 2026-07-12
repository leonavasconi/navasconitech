import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/marketplace/ProductForm";
import type { MarketplaceCategory } from "@/lib/types";

export default async function NewProductPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: seller } = await supabase.from("sellers").select("id").eq("user_id", user!.id).maybeSingle();
  if (!seller) redirect("/marketplace/vender");

  const { data: categories } = await supabase.from("product_categories").select("*").order("name");

  return (
    <div className="mx-auto max-w-lg p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="mb-6 text-xl font-semibold text-slate-900">Novo produto</h1>
        <ProductForm categories={(categories ?? []) as MarketplaceCategory[]} />
      </div>
    </div>
  );
}
