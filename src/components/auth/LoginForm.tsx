"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm({ redirectTo, signupHref }: { redirectTo: string; signupHref: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(values);

    if (error) {
      setServerError(
        error.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos."
          : error.message,
      );
      return;
    }

    router.push(searchParams.get("redirect") || redirectTo);
    router.refresh();
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Input label="E-mail" type="email" autoComplete="email" {...register("email")} error={errors.email?.message} />
      <Input
        label="Senha"
        type="password"
        autoComplete="current-password"
        {...register("password")}
        error={errors.password?.message}
      />

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Entrando..." : "Entrar"}
      </Button>

      <p className="text-center text-sm text-slate-500">
        Não tem uma conta?{" "}
        <Link href={signupHref} className="font-medium text-[var(--brand-600)] hover:underline">
          Criar conta
        </Link>
      </p>
    </form>
  );
}
