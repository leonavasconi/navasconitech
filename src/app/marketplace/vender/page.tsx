import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BecomeSellerForm } from "@/components/marketplace/BecomeSellerForm";

export default async function BecomeSellerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: existing } = await supabase.from("sellers").select("id").eq("user_id", user!.id).maybeSingle();
  if (existing) redirect("/marketplace/painel");

  return (
    <div className="mx-auto max-w-md p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="mb-1 text-xl font-semibold text-slate-900">Comece a vender na Vitrine</h1>
        <p className="mb-6 text-sm text-slate-500">Crie sua loja em menos de um minuto.</p>
        <BecomeSellerForm />
      </div>
    </div>
  );
}
