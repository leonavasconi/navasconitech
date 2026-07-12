"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  type: z.enum(["furto", "roubo", "outro"]),
  description: z.string().min(1),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  address: z.string().optional(),
  occurredAt: z.string().min(1),
  photoUrl: z.string().optional(),
});

export type OccurrenceInput = z.infer<typeof schema>;

export async function createOccurrence(input: OccurrenceInput) {
  const values = schema.parse(input);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { error } = await supabase.from("occurrences").insert({
    user_id: user.id,
    type: values.type,
    description: values.description,
    latitude: values.latitude,
    longitude: values.longitude,
    address: values.address || null,
    occurred_at: values.occurredAt,
    photo_url: values.photoUrl || null,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/arhus");
  revalidatePath("/arhus/minhas-ocorrencias");
}

export async function deleteOccurrence(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("occurrences").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/arhus");
  revalidatePath("/arhus/minhas-ocorrencias");
}
