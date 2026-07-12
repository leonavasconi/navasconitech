"use client";

import dynamic from "next/dynamic";

export const OccurrenceMapClient = dynamic(
  () => import("@/components/arhus/OccurrenceMap").then((mod) => mod.OccurrenceMap),
  { ssr: false, loading: () => <div className="flex h-full items-center justify-center text-sm text-slate-400">Carregando mapa...</div> },
);
