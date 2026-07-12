import { type InputHTMLAttributes, type SelectHTMLAttributes, forwardRef } from "react";

interface FieldWrapperProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export function FieldWrapper({ label, error, children }: FieldWrapperProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className = "", ...props },
  ref,
) {
  return (
    <FieldWrapper label={label} error={error}>
      <input
        ref={ref}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-[var(--brand-500)]/40 ${
          error ? "border-red-400" : "border-slate-300 focus:border-[var(--brand-500)]"
        } ${className}`}
        {...props}
      />
    </FieldWrapper>
  );
});

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  children: React.ReactNode;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, className = "", children, ...props },
  ref,
) {
  return (
    <FieldWrapper label={label} error={error}>
      <select
        ref={ref}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-[var(--brand-500)]/40 ${
          error ? "border-red-400" : "border-slate-300 focus:border-[var(--brand-500)]"
        } ${className}`}
        {...props}
      >
        {children}
      </select>
    </FieldWrapper>
  );
});
