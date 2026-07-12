"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { OCCURRENCE_COLORS, OCCURRENCE_LABELS, DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "@/lib/arhus/constants";
import { formatDate } from "@/lib/financas/format";
import type { Occurrence } from "@/lib/types";

export function OccurrenceMap({ occurrences }: { occurrences: Occurrence[] }) {
  return (
    <MapContainer
      center={DEFAULT_MAP_CENTER}
      zoom={DEFAULT_MAP_ZOOM}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {occurrences.map((occurrence) => (
        <CircleMarker
          key={occurrence.id}
          center={[occurrence.latitude, occurrence.longitude]}
          radius={9}
          pathOptions={{
            color: OCCURRENCE_COLORS[occurrence.type],
            fillColor: OCCURRENCE_COLORS[occurrence.type],
            fillOpacity: 0.85,
            weight: 2,
          }}
        >
          <Popup>
            <div className="space-y-1">
              <p className="font-semibold">{OCCURRENCE_LABELS[occurrence.type]}</p>
              <p>{occurrence.description}</p>
              {occurrence.address && <p className="text-slate-500">{occurrence.address}</p>}
              <p className="text-slate-400">{formatDate(occurrence.occurred_at.slice(0, 10))}</p>
              {occurrence.photo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={occurrence.photo_url} alt="" className="mt-2 w-full rounded" />
              )}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
