export type ZoneId = "about" | "projects" | "skills" | "contact";

export interface Zone {
  id: ZoneId;
  label: string;
  position: { x: number; z: number };
  triggerRadius: number;
}

export const ZONES: Zone[] = [
  { id: "about", label: "About", position: { x: -8, z: -8 }, triggerRadius: 3 },
  { id: "projects", label: "Projects", position: { x: 8, z: -8 }, triggerRadius: 3.5 },
  { id: "skills", label: "Skills", position: { x: 8, z: 8 }, triggerRadius: 3 },
  { id: "contact", label: "Contact", position: { x: -8, z: 8 }, triggerRadius: 3 },
];
