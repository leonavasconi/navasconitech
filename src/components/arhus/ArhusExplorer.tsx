"use client";

import { useMemo, useState } from "react";
import { OccurrenceMapClient } from "@/components/arhus/OccurrenceMapClient";
import { OCCURRENCE_LABELS, OCCURRENCE_COLORS } from "@/lib/arhus/constants";
import { formatDate } from "@/lib/financas/format";
import type { Occurrence, OccurrenceType } from "@/lib/types";

type TypeFilter = "all" | OccurrenceType;
type PeriodFilter = "7" | "30" | "all";

const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "Todos os tipos" },
  { value: "furto", label: "Furto" },
  { value: "roubo", label: "Roubo" },
  { value: "outro", label: "Outro" },
];

const PERIOD_FILTERS: { value: PeriodFilter; label: string }[] = [
  { value: "7", label: "Últimos 7 dias" },
  { value: "30", label: "Últimos 30 dias" },
  { value: "all", label: "Todo o período" },
];

export function ArhusExplorer({ occurrences }: { occurrences: Occurrence[] }) {
  const [type, setType] = useState<TypeFilter>("all");
  const [period, setPeriod] = useState<PeriodFilter>("30");

  const filtered = useMemo(() => {
    const now = Date.now();
    return occurrences.filter((o) => {
      if (type !== "all" && o.type !== type) return false;
      if (period !== "all") {
        const days = Number(period);
        const ageMs = now - new Date(o.occurred_at).getTime();
        if (ageMs > days * 24 * 60 * 60 * 1000) return false;
      }
      return true;
    });
  }, [occurrences, type, period]);

  return (
    <div className="flex h-[calc(100vh-73px)] flex-col lg:flex-row">
      <div className="flex flex-col gap-4 overflow-y-auto border-b border-slate-200 bg-white p-4 lg:w-96 lg:border-b-0 lg:border-r">
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setType(f.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                type === f.value ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {PERIOD_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setPeriod(f.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                period === f.value ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-400">
          {filtered.length} ocorrência{filtered.length === 1 ? "" : "s"} encontrada
          {filtered.length === 1 ? "" : "s"}
        </p>

        {filtered.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400">Nenhuma ocorrência para esse filtro.</p>
        ) : (
          <ul className="space-y-3">
            {filtered.map((o) => (
              <li key={o.id} className="rounded-xl border border-slate-100 p-3">
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: OCCURRENCE_COLORS[o.type] }}
                  />
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {OCCURRENCE_LABELS[o.type]}
                  </span>
                  <span className="ml-auto text-xs text-slate-400">
                    {formatDate(o.occurred_at.slice(0, 10))}
                  </span>
                </div>
                <p className="text-sm text-slate-700">{o.description}</p>
                {o.address && <p className="mt-1 text-xs text-slate-400">{o.address}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex-1">
        <OccurrenceMapClient occurrences={filtered} />
      </div>
    </div>
  );
}
