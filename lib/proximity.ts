import type { Zone, ZoneId } from "./zones";

export interface Point2D {
  x: number;
  z: number;
}

export function distance2D(a: Point2D, b: Point2D): number {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dz * dz);
}

export function findActiveZone(playerPosition: Point2D, zones: Zone[]): ZoneId | null {
  for (const zone of zones) {
    if (distance2D(playerPosition, zone.position) <= zone.triggerRadius) {
      return zone.id;
    }
  }
  return null;
}
