import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { createClient } from "@/lib/supabase/server";
import { VitrineNav } from "@/components/marketplace/VitrineNav";

export const metadata: Metadata = {
  title: "Vitrine | Leonardo Navasconi",
  description: "Marketplace multi-vendedor: compre, venda, conecte.",
};

const VITRINE_BRAND = {
  "--brand-50": "#f5f3ff",
  "--brand-100": "#ede9fe",
  "--brand-300": "#c4b5fd",
  "--brand-400": "#a78bfa",
  "--brand-500": "#8b5cf6",
  "--brand-600": "#7c3aed",
  "--brand-700": "#6d28d9",
} as CSSProperties;

export default async function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isSeller = false;
  let cartCount = 0;

  if (user) {
    const [{ data: seller }, { data: cartItems }] = await Promise.all([
      supabase.from("sellers").select("id").eq("user_id", user.id).maybeSingle(),
      supabase.from("cart_items").select("quantity").eq("user_id", user.id),
    ]);
    isSeller = !!seller;
    cartCount = (cartItems ?? []).reduce((sum, item) => sum + item.quantity, 0);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" style={VITRINE_BRAND}>
      <VitrineNav isLoggedIn={!!user} isSeller={isSeller} cartCount={cartCount} />
      {children}
    </div>
  );
}
