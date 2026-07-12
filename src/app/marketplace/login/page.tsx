import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function MarketplaceLoginPage() {
  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-center text-xl font-semibold text-slate-900">Entrar na Vitrine</h1>
        <Suspense>
          <LoginForm redirectTo="/marketplace" signupHref="/marketplace/signup" />
        </Suspense>
      </div>
    </div>
  );
}
