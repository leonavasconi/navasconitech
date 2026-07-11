"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createRecurringRule } from "@/app/financas/(app)/recurring/actions";
import type { Account, Category } from "@/lib/types";

const schema = z.object({
  accountId: z.string().min(1, "Selecione uma conta"),
  categoryId: z.string().optional(),
  description: z.string().min(1, "Informe uma descrição"),
  amount: z.coerce.number().positive("Informe um valor válido"),
  type: z.enum(["income", "expense"]),
  frequency: z.enum(["weekly", "monthly", "yearly"]),
  startDate: z.string().min(1),
});

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

export function RecurringForm({
  accounts,
  categories,
  onClose,
}: {
  accounts: Account[];
  categories: Category[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "expense",
      frequency: "monthly",
      startDate: new Date().toISOString().slice(0, 10),
      accountId: accounts[0]?.id ?? "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await createRecurringRule(values);
      router.refresh();
      onClose();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Erro ao salvar conta recorrente");
    }
  };

  return (
    <Modal title="Nova conta recorrente" onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Descrição" placeholder="Ex: Aluguel, Netflix..." {...register("description")} error={errors.description?.message} />
        <Input label="Valor" type="number" step="0.01" {...register("amount")} error={errors.amount?.message} />

        <Select label="Tipo" {...register("type")}>
          <option value="expense">Despesa</option>
          <option value="income">Receita</option>
        </Select>

        <Select label="Frequência" {...register("frequency")}>
          <option value="weekly">Semanal</option>
          <option value="monthly">Mensal</option>
          <option value="yearly">Anual</option>
        </Select>

        <Input label="Próxima cobrança" type="date" {...register("startDate")} error={errors.startDate?.message} />

        <Select label="Conta" {...register("accountId")} error={errors.accountId?.message}>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </Select>

        <Select label="Categoria (opcional)" {...register("categoryId")}>
          <option value="">Sem categoria</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </Modal>
  );
}
