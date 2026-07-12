import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ArhusNav } from "@/components/arhus/ArhusNav";

export const metadata: Metadata = {
  title: "Arhus | Leonardo Navasconi",
  description: "Mapa colaborativo de furtos e roubos da comunidade.",
};

export default async function ArhusLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <ArhusNav isLoggedIn={!!user} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
