import { SignupForm } from "@/components/auth/SignupForm";

export default function ArhusSignupPage() {
  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-center text-xl font-semibold text-slate-900">Criar conta no Arhus</h1>
        <SignupForm redirectTo="/arhus" loginHref="/arhus/login" />
      </div>
    </div>
  );
}
