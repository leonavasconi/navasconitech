export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <img
            src="/assets/img/monetix-logo.png"
            alt="Monetix"
            className="mx-auto aspect-[2/1] w-40 object-cover object-top"
          />
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Organize sua vida financeira</h1>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">{children}</div>
      </div>
    </div>
  );
}
