"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  name: z.string().min(1),
  kind: z.enum(["income", "expense"]),
  color: z.string().min(1),
});

export async function createCategory(input: z.infer<typeof schema>) {
  const values = schema.parse(input);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { data, error } = await supabase
    .from("categories")
    .insert({ user_id: user.id, name: values.name, kind: values.kind, color: values.color, icon: "tag" })
    .select()
    .single();
  if (error) throw new Error(error.message);

  revalidatePath("/financas/transactions");
  revalidatePath("/financas/budgets");
  return data;
}
