"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LocateFixed } from "lucide-react";
import { LocationPickerClient } from "@/components/arhus/LocationPickerClient";
import { Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { createOccurrence } from "@/app/arhus/actions";
import type { OccurrenceType } from "@/lib/types";

export function OccurrenceForm() {
  const router = useRouter();
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [type, setType] = useState<OccurrenceType>("furto");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [occurredAt, setOccurredAt] = useState(new Date().toISOString().slice(0, 16));
  const [photo, setPhoto] = useState<File | null>(null);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!position) {
      setError("Clique no mapa para marcar o local da ocorrência.");
      return;
    }
    if (!description.trim()) {
      setError("Descreva o que aconteceu.");
      return;
    }

    setSubmitting(true);
    try {
      let photoUrl: string | undefined;

      if (photo) {
        const supabase = createClient();
        const path = `${crypto.randomUUID()}-${photo.name}`;
        const { error: uploadError } = await supabase.storage
          .from("occurrence-photos")
          .upload(path, photo);
        if (uploadError) throw new Error(uploadError.message);

        const { data } = supabase.storage.from("occurrence-photos").getPublicUrl(path);
        photoUrl = data.publicUrl;
      }

      await createOccurrence({
        type,
        description: description.trim(),
        latitude: position[0],
        longitude: position[1],
        address: address.trim() || undefined,
        occurredAt: new Date(occurredAt).toISOString(),
        photoUrl,
      });

      router.push("/arhus");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao registrar ocorrência");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex h-[calc(100vh-73px)] flex-col lg:flex-row">
      <div className="flex flex-col gap-4 overflow-y-auto border-b border-slate-200 bg-white p-6 lg:w-96 lg:border-b-0 lg:border-r">
        <h1 className="text-lg font-semibold text-slate-900">Reportar ocorrência</h1>

        <Select label="Tipo" value={type} onChange={(e) => setType(e.target.value as OccurrenceType)}>
          <option value="furto">Furto</option>
          <option value="roubo">Roubo</option>
          <option value="outro">Outro</option>
        </Select>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Descrição</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
            placeholder="O que aconteceu?"
          />
        </label>

        <Input
          label="Endereço / ponto de referência (opcional)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <Input
          label="Data e hora"
          type="datetime-local"
          value={occurredAt}
          onChange={(e) => setOccurredAt(e.target.value)}
        />

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Foto (opcional)</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
            className="w-full text-sm"
          />
        </label>

        <Button type="button" variant="secondary" disabled={locating} onClick={useMyLocation}>
          <LocateFixed size={16} />
          {locating ? "Localizando..." : "Usar minha localização"}
        </Button>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={submitting}>
          {submitting ? "Enviando..." : "Registrar ocorrência"}
        </Button>

        <p className="text-xs text-slate-400">Clique no mapa para marcar exatamente onde aconteceu.</p>
      </div>

      <div className="flex-1">
        <LocationPickerClient position={position} onPick={(lat, lng) => setPosition([lat, lng])} />
      </div>
    </form>
  );
}
