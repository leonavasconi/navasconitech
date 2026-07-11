"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createGoal } from "@/app/financas/(app)/goals/actions";

const schema = z.object({
  name: z.string().min(1, "Informe um nome"),
  targetAmount: z.coerce.number().positive("Informe um valor válido"),
  targetDate: z.string().optional(),
  color: z.string().min(1),
});

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

export function GoalForm({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormValues>({ resolver: zodResolver(schema), defaultValues: { color: "#22c55e" } });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await createGoal(values);
      router.refresh();
      onClose();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Erro ao salvar meta");
    }
  };

  return (
    <Modal title="Nova meta de economia" onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Nome" placeholder="Ex: Viagem, Reserva de emergência..." {...register("name")} error={errors.name?.message} />
        <Input label="Valor alvo" type="number" step="0.01" {...register("targetAmount")} error={errors.targetAmount?.message} />
        <Input label="Data alvo (opcional)" type="date" {...register("targetDate")} />
        <Input label="Cor" type="color" className="h-10 p-1" {...register("color")} />

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Salvando..." : "Salvar meta"}
        </Button>
      </form>
    </Modal>
  );
}
