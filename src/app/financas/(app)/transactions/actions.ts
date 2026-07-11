"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  accountId: z.string().uuid(),
  categoryId: z.string().uuid().optional().or(z.literal("")),
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().positive(),
  description: z.string().min(1),
  occurredOn: z.string().min(1),
});

export type TransactionInput = z.infer<typeof schema>;

export async function createTransaction(input: TransactionInput) {
  const values = schema.parse(input);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { error } = await supabase.from("transactions").insert({
    user_id: user.id,
    account_id: values.accountId,
    category_id: values.categoryId || null,
    type: values.type,
    amount: values.amount,
    description: values.description,
    occurred_on: values.occurredOn,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/financas/transactions");
  revalidatePath("/financas/dashboard");
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/financas/transactions");
  revalidatePath("/financas/dashboard");
}
