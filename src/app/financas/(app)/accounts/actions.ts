"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { AccountType } from "@/lib/types";

const schema = z.object({
  name: z.string().min(1),
  type: z.enum(["checking", "savings", "credit_card", "cash", "investment"]),
  institution: z.string().optional(),
  color: z.string().min(1),
  initialBalance: z.coerce.number(),
});

export type AccountInput = {
  name: string;
  type: AccountType;
  institution?: string;
  color: string;
  initialBalance: number;
};

export async function createAccount(input: AccountInput) {
  const values = schema.parse(input);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { error } = await supabase.from("accounts").insert({
    user_id: user.id,
    name: values.name,
    type: values.type,
    institution: values.institution || null,
    color: values.color,
    initial_balance: values.initialBalance,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/financas/accounts");
  revalidatePath("/financas/dashboard");
}

export async function archiveAccount(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("accounts").update({ archived: true }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/financas/accounts");
  revalidatePath("/financas/dashboard");
}
