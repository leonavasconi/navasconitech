"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  accountId: z.string().uuid(),
  categoryId: z.string().uuid().optional().or(z.literal("")),
  description: z.string().min(1),
  amount: z.coerce.number().positive(),
  type: z.enum(["income", "expense"]),
  frequency: z.enum(["weekly", "monthly", "yearly"]),
  startDate: z.string().min(1),
});

export async function createRecurringRule(input: z.infer<typeof schema>) {
  const values = schema.parse(input);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { error } = await supabase.from("recurring_rules").insert({
    user_id: user.id,
    account_id: values.accountId,
    category_id: values.categoryId || null,
    description: values.description,
    amount: values.amount,
    type: values.type,
    frequency: values.frequency,
    start_date: values.startDate,
    next_run_date: values.startDate,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/financas/recurring");
}

function advance(date: string, frequency: "weekly" | "monthly" | "yearly") {
  const d = new Date(`${date}T00:00:00`);
  if (frequency === "weekly") d.setDate(d.getDate() + 7);
  if (frequency === "monthly") d.setMonth(d.getMonth() + 1);
  if (frequency === "yearly") d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
}

export async function postRecurringNow(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { data: rule, error: fetchError } = await supabase
    .from("recurring_rules")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError || !rule) throw new Error(fetchError?.message ?? "Regra não encontrada");

  const { error: insertError } = await supabase.from("transactions").insert({
    user_id: user.id,
    account_id: rule.account_id,
    category_id: rule.category_id,
    recurring_rule_id: rule.id,
    type: rule.type,
    amount: rule.amount,
    description: rule.description,
    occurred_on: rule.next_run_date,
  });
  if (insertError) throw new Error(insertError.message);

  const { error: updateError } = await supabase
    .from("recurring_rules")
    .update({ next_run_date: advance(rule.next_run_date, rule.frequency) })
    .eq("id", id);
  if (updateError) throw new Error(updateError.message);

  revalidatePath("/financas/recurring");
  revalidatePath("/financas/transactions");
  revalidatePath("/financas/dashboard");
}

export async function toggleRecurringActive(id: string, active: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("recurring_rules").update({ active }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/financas/recurring");
  revalidatePath("/financas/dashboard");
}
