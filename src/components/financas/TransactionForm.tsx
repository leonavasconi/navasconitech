"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createTransaction } from "@/app/financas/(app)/transactions/actions";
import { createCategory } from "@/lib/financas/category-actions";
import type { Account, Category } from "@/lib/types";

const schema = z.object({
  accountId: z.string().min(1, "Selecione uma conta"),
  categoryId: z.string().optional(),
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().positive("Informe um valor válido"),
  description: z.string().min(1, "Informe uma descrição"),
  occurredOn: z.string().min(1),
});

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

export function TransactionForm({
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
  const [localCategories, setLocalCategories] = useState(categories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "expense",
      occurredOn: new Date().toISOString().slice(0, 10),
      accountId: accounts[0]?.id ?? "",
    },
  });

  const type = watch("type");
  const filteredCategories = localCategories.filter((c) => c.kind === type);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setCreatingCategory(true);
    try {
      const category = await createCategory({
        name: newCategoryName.trim(),
        kind: type,
        color: "#6366f1",
      });
      setLocalCategories((prev) => [...prev, category as Category]);
      setValue("categoryId", category.id);
      setNewCategoryName("");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Erro ao criar categoria");
    } finally {
      setCreatingCategory(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await createTransaction(values);
      router.refresh();
      onClose();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Erro ao salvar lançamento");
    }
  };

  return (
    <Modal title="Novo lançamento" onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setValue("type", "expense")}
            className={`rounded-lg border px-3 py-2 text-sm font-medium ${
              type === "expense" ? "border-red-400 bg-red-50 text-red-600" : "border-slate-200 text-slate-500"
            }`}
          >
            Despesa
          </button>
          <button
            type="button"
            onClick={() => setValue("type", "income")}
            className={`rounded-lg border px-3 py-2 text-sm font-medium ${
              type === "income" ? "border-emerald-400 bg-emerald-50 text-emerald-600" : "border-slate-200 text-slate-500"
            }`}
          >
            Receita
          </button>
        </div>

        <Input label="Descrição" {...register("description")} error={errors.description?.message} />

        <Input label="Valor" type="number" step="0.01" {...register("amount")} error={errors.amount?.message} />

        <Input label="Data" type="date" {...register("occurredOn")} error={errors.occurredOn?.message} />

        <Select label="Conta" {...register("accountId")} error={errors.accountId?.message}>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </Select>

        <Select label="Categoria (opcional)" {...register("categoryId")}>
          <option value="">Sem categoria</option>
          {filteredCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>

        <div className="flex gap-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nova categoria..."
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
          />
          <Button type="button" variant="secondary" disabled={creatingCategory} onClick={handleCreateCategory}>
            + Criar
          </Button>
        </div>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Salvando..." : "Salvar lançamento"}
        </Button>
      </form>
    </Modal>
  );
}
