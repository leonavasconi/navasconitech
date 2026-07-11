"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  categoryId: z.string().uuid(),
  month: z.string().min(1),
  amount: z.coerce.number().min(0),
});

export async function setBudget(input: z.infer<typeof schema>) {
  const values = schema.parse(input);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { error } = await supabase
    .from("budgets")
    .upsert(
      { user_id: user.id, category_id: values.categoryId, month: values.month, amount: values.amount },
      { onConflict: "user_id,category_id,month" },
    );
  if (error) throw new Error(error.message);

  revalidatePath("/financas/budgets");
  revalidatePath("/financas/dashboard");
}
