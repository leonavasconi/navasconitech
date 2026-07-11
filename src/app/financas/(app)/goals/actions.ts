"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const goalSchema = z.object({
  name: z.string().min(1),
  targetAmount: z.coerce.number().positive(),
  targetDate: z.string().optional().or(z.literal("")),
  color: z.string().min(1),
});

export async function createGoal(input: z.infer<typeof goalSchema>) {
  const values = goalSchema.parse(input);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { error } = await supabase.from("goals").insert({
    user_id: user.id,
    name: values.name,
    target_amount: values.targetAmount,
    target_date: values.targetDate || null,
    color: values.color,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/financas/goals");
}

const contributionSchema = z.object({
  goalId: z.string().uuid(),
  amount: z.coerce.number().refine((v) => v !== 0, "Informe um valor diferente de zero"),
});

export async function addContribution(input: z.infer<typeof contributionSchema>) {
  const values = contributionSchema.parse(input);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { error } = await supabase.from("goal_contributions").insert({
    goal_id: values.goalId,
    user_id: user.id,
    amount: values.amount,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/financas/goals");
}
