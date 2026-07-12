"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const schema = z.object({
  storeName: z.string().min(2),
  description: z.string().optional(),
});

export async function createSeller(input: z.infer<typeof schema>) {
  const values = schema.parse(input);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const baseSlug = slugify(values.storeName) || "loja";
  let slug = baseSlug;
  let suffix = 1;
  while (true) {
    const { data: existing } = await supabase.from("sellers").select("id").eq("slug", slug).maybeSingle();
    if (!existing) break;
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const { error } = await supabase.from("sellers").insert({
    user_id: user.id,
    store_name: values.storeName,
    slug,
    description: values.description || null,
    status: "approved",
  });
  if (error) throw new Error(error.message);

  revalidatePath("/marketplace", "layout");
}
