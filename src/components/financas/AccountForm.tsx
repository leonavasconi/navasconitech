"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createAccount } from "@/app/financas/(app)/accounts/actions";

const schema = z.object({
  name: z.string().min(1, "Informe um nome"),
  type: z.enum(["checking", "savings", "credit_card", "cash", "investment"]),
  institution: z.string().optional(),
  color: z.string().min(1),
  initialBalance: z.coerce.number(),
});

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

const TYPE_LABELS: Record<FormValues["type"], string> = {
  checking: "Conta corrente",
  savings: "Poupança",
  credit_card: "Cartão de crédito",
  cash: "Dinheiro",
  investment: "Investimento",
};

export function AccountForm({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: "checking", color: "#059669", initialBalance: 0 },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await createAccount(values);
      router.refresh();
      onClose();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Erro ao salvar conta");
    }
  };

  return (
    <Modal title="Nova conta" onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Nome" placeholder="Ex: Nubank, Carteira..." {...register("name")} error={errors.name?.message} />

        <Select label="Tipo" {...register("type")} error={errors.type?.message}>
          {Object.entries(TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>

        <Input label="Instituição (opcional)" {...register("institution")} />

        <Input
          label="Saldo inicial"
          type="number"
          step="0.01"
          {...register("initialBalance")}
          error={errors.initialBalance?.message}
        />

        <Input label="Cor" type="color" className="h-10 p-1" {...register("color")} />

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Salvando..." : "Salvar conta"}
        </Button>
      </form>
    </Modal>
  );
}
