export type SkillCategory = {
  category: string;
  items: string[];
};

export const skillCategories: SkillCategory[] = [
  { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { category: "Backend", items: ["Node.js", "PostgreSQL", "REST APIs", "Prisma"] },
  { category: "AI / Automation", items: ["LLM Agents", "RAG Pipelines", "n8n", "Vector DBs"] },
  { category: "Tools", items: ["Git", "Docker", "Vercel", "CI/CD"] },
];
