"use client";

import { useEffect } from "react";
import type { ZoneId } from "@/lib/zones";
import { ABOUT } from "@/data/about";
import { PROJECTS } from "@/data/projects";
import { SKILLS } from "@/data/skills";
import { CONTACT } from "@/data/contact";

function SectionBody({ zoneId }: { zoneId: ZoneId }) {
  switch (zoneId) {
    case "about":
      return (
        <div>
          <h2 className="text-2xl font-bold">{ABOUT.name}</h2>
          <p className="mt-1 text-neutral-400">{ABOUT.tagline}</p>
          <div className="mt-4 flex flex-col gap-2">
            {ABOUT.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      );
    case "projects":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          {PROJECTS.map((project) => (
            <a
              key={project.id}
              href={project.link}
              className="rounded border border-neutral-700 p-3 hover:border-neutral-400"
            >
              <h3 className="font-semibold">{project.title}</h3>
              <p className="mt-1 text-sm text-neutral-400">{project.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded bg-neutral-800 px-2 py-1 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      );
    case "skills":
      return (
        <div className="flex flex-col gap-3">
          {SKILLS.map((group) => (
            <div key={group.category}>
              <h3 className="font-semibold">{group.category}</h3>
              <p className="mt-1 text-sm text-neutral-400">{group.items.join(", ")}</p>
            </div>
          ))}
        </div>
      );
    case "contact":
      return (
        <div className="flex flex-col gap-2 text-sm">
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <a href={CONTACT.github}>{CONTACT.github}</a>
          <a href={CONTACT.linkedin}>{CONTACT.linkedin}</a>
        </div>
      );
  }
}

const ZONE_TITLES: Record<ZoneId, string> = {
  about: "About",
  projects: "Projects",
  skills: "Skills",
  contact: "Contact",
};

export function SectionPanel({
  zoneId,
  onClose,
}: {
  zoneId: ZoneId;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 p-6">
      <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-neutral-900 p-6 text-white">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{ZONE_TITLES[zoneId]}</h2>
          <button
            onClick={onClose}
            className="rounded px-2 py-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            Close
          </button>
        </div>
        <SectionBody zoneId={zoneId} />
      </div>
    </div>
  );
}
