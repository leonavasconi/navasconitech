"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton({
  redirectTo,
  className = "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700",
}: {
  redirectTo: string;
  className?: string;
}) {
  const router = useRouter();

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(redirectTo);
    router.refresh();
  };

  return (
    <button type="button" onClick={signOut} className={className}>
      <LogOut size={16} />
      Sair
    </button>
  );
}
