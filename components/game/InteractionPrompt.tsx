"use client";

import { ZONES, type ZoneId } from "@/lib/zones";

export function InteractionPrompt({ activeZone }: { activeZone: ZoneId | null }) {
  if (!activeZone) return null;
  const zone = ZONES.find((z) => z.id === activeZone);
  if (!zone) return null;

  return (
    <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 rounded bg-black/70 px-4 py-2 text-white">
      Press <span className="font-bold">E</span> to view {zone.label}
    </div>
  );
}
