"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createSeller } from "@/app/marketplace/vender/actions";

interface FormValues {
  storeName: string;
  description?: string;
}

export function BecomeSellerForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await createSeller(values);
      router.push("/marketplace/painel");
      router.refresh();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Erro ao criar loja");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Nome da loja"
        placeholder="Ex: Loja da Maria"
        {...register("storeName", { required: true, minLength: 2 })}
        error={errors.storeName && "Informe o nome da sua loja"}
      />

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Descrição (opcional)</span>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/40"
          placeholder="Conte um pouco sobre o que você vende"
        />
      </label>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Criando loja..." : "Criar minha loja"}
      </Button>
    </form>
  );
}
