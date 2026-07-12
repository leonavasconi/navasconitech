import { SignupForm } from "@/components/auth/SignupForm";

export default function MarketplaceSignupPage() {
  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-center text-xl font-semibold text-slate-900">Criar conta na Vitrine</h1>
        <SignupForm redirectTo="/marketplace" loginHref="/marketplace/login" />
      </div>
    </div>
  );
}
