export interface ProjectEntry {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
}

export const PROJECTS: ProjectEntry[] = [
  {
    id: "project-one",
    title: "Placeholder Project One",
    description: "A short placeholder description of what this project does.",
    tags: ["Next.js", "TypeScript"],
    link: "https://example.com/project-one",
  },
  {
    id: "project-two",
    title: "Placeholder Project Two",
    description: "Another short placeholder description of a different project.",
    tags: ["Three.js", "React"],
    link: "https://example.com/project-two",
  },
];
