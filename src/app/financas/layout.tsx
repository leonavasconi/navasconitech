import type { Metadata } from "next";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Monetix | Leonardo Navasconi",
  description: "Contas, lançamentos, orçamento, metas e contas recorrentes em um só lugar.",
};

const MONETIX_BRAND = {
  "--brand-50": "#ecfdf5",
  "--brand-100": "#d1fae5",
  "--brand-300": "#6ee7b7",
  "--brand-400": "#34d399",
  "--brand-500": "#10b981",
  "--brand-600": "#059669",
  "--brand-700": "#047857",
} as CSSProperties;

export default function FinancasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" style={MONETIX_BRAND}>
      {children}
    </div>
  );
}
