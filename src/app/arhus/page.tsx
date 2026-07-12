import { createClient } from "@/lib/supabase/server";
import { ArhusExplorer } from "@/components/arhus/ArhusExplorer";
import type { Occurrence } from "@/lib/types";

export default async function ArhusMapPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("occurrences")
    .select("*")
    .order("occurred_at", { ascending: false });

  return <ArhusExplorer occurrences={(data ?? []) as Occurrence[]} />;
}
