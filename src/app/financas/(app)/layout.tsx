import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/financas/Sidebar";
import { SignOutButton } from "@/components/financas/SignOutButton";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let fullName: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();
    fullName = profile?.full_name ?? null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
          <div>
            <p className="text-sm text-slate-500">Bem-vindo de volta</p>
            <p className="font-medium text-slate-900">{fullName || user?.email}</p>
          </div>
          <SignOutButton />
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
