"use client";

import { motion } from "framer-motion";
import type { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -4 }}
      className="block rounded-2xl border border-foreground/10 p-6 shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="mb-4 flex aspect-video items-center justify-center rounded-xl bg-accent/10">
        <span className="text-xs text-foreground/50">{project.imageAlt}</span>
      </div>
      <h3 className="font-heading text-xl font-semibold">{project.title}</h3>
      <p className="mt-2 text-sm text-foreground/70">{project.description}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
          >
            {tag}
          </li>
        ))}
      </ul>
    </motion.a>
  );
}
