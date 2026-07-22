"use client";

import { ZONES } from "@/lib/zones";
import { ZoneLandmark } from "./ZoneLandmark";

export function Zones() {
  return (
    <>
      {ZONES.map((zone) => (
        <ZoneLandmark key={zone.id} zone={zone} />
      ))}
    </>
  );
}
