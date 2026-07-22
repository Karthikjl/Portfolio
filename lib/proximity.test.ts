import { describe, expect, it } from "vitest";
import { distance2D, findActiveZone } from "./proximity";
import type { Zone } from "./zones";

describe("distance2D", () => {
  it("computes euclidean distance in the x/z plane", () => {
    expect(distance2D({ x: 0, z: 0 }, { x: 3, z: 4 })).toBe(5);
  });
});

describe("findActiveZone", () => {
  const zones: Zone[] = [
    { id: "about", label: "About", position: { x: 0, z: 0 }, triggerRadius: 2 },
    { id: "projects", label: "Projects", position: { x: 10, z: 10 }, triggerRadius: 2 },
  ];

  it("returns the zone id when the player is within the trigger radius", () => {
    expect(findActiveZone({ x: 1, z: 1 }, zones)).toBe("about");
  });

  it("returns null when the player is outside every trigger radius", () => {
    expect(findActiveZone({ x: 5, z: 5 }, zones)).toBeNull();
  });

  it("treats a distance exactly equal to the trigger radius as inside the zone", () => {
    expect(findActiveZone({ x: 2, z: 0 }, zones)).toBe("about");
  });
});
