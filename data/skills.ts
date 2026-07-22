export interface SkillGroup {
  category: string;
  items: string[];
}

export const SKILLS: SkillGroup[] = [
  { category: "Languages", items: ["TypeScript", "Python"] },
  { category: "Frameworks", items: ["Next.js", "React", "Three.js"] },
  { category: "Tools", items: ["Git", "Docker"] },
];
