import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { OCCURRENCE_LABELS, OCCURRENCE_COLORS } from "@/lib/arhus/constants";
import { formatDate } from "@/lib/financas/format";
import { DeleteOccurrenceButton } from "@/components/arhus/DeleteOccurrenceButton";
import type { Occurrence } from "@/lib/types";

export default async function MinhasOcorrenciasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("occurrences")
    .select("*")
    .eq("user_id", user!.id)
    .order("occurred_at", { ascending: false });

  const occurrences = (data ?? []) as Occurrence[];

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Minhas ocorrências</h1>
        <Link href="/arhus/nova" className="text-sm font-medium text-indigo-600 hover:underline">
          + Reportar nova
        </Link>
      </div>

      {occurrences.length === 0 ? (
        <p className="text-sm text-slate-400">Você ainda não reportou nenhuma ocorrência.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <ul className="divide-y divide-slate-100">
            {occurrences.map((o) => (
              <li key={o.id} className="flex items-center justify-between px-6 py-4 text-sm">
                <div className="flex items-start gap-3">
                  <span
                    className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: OCCURRENCE_COLORS[o.type] }}
                  />
                  <div>
                    <p className="font-medium text-slate-800">
                      {OCCURRENCE_LABELS[o.type]} · {formatDate(o.occurred_at.slice(0, 10))}
                    </p>
                    <p className="text-slate-500">{o.description}</p>
                    {o.address && <p className="text-slate-400">{o.address}</p>}
                  </div>
                </div>
                <DeleteOccurrenceButton id={o.id} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
