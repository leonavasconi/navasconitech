import type { OccurrenceType } from "@/lib/types";

export const OCCURRENCE_LABELS: Record<OccurrenceType, string> = {
  furto: "Furto",
  roubo: "Roubo",
  outro: "Outro",
};

export const OCCURRENCE_COLORS: Record<OccurrenceType, string> = {
  furto: "#f59e0b",
  roubo: "#ef4444",
  outro: "#6366f1",
};

// Centered on Santos - SP (Baixada Santista), where Arhus was originally built.
export const DEFAULT_MAP_CENTER: [number, number] = [-23.9608, -46.3336];
export const DEFAULT_MAP_ZOOM = 12;
