"use client";

import dynamic from "next/dynamic";

export const LocationPickerClient = dynamic(
  () => import("@/components/arhus/LocationPicker").then((mod) => mod.LocationPicker),
  { ssr: false, loading: () => <div className="flex h-full items-center justify-center text-sm text-slate-400">Carregando mapa...</div> },
);
