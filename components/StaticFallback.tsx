import { ABOUT } from "@/data/about";
import { PROJECTS } from "@/data/projects";
import { SKILLS } from "@/data/skills";
import { CONTACT } from "@/data/contact";

export function StaticFallback() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-16 px-6 py-16">
      <section id="about">
        <h1 className="text-3xl font-bold">{ABOUT.name}</h1>
        <p className="mt-2 text-lg text-neutral-500">{ABOUT.tagline}</p>
        <div className="mt-6 flex flex-col gap-4">
          {ABOUT.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section id="projects">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {PROJECTS.map((project) => (
            <a
              key={project.id}
              href={project.link}
              className="rounded-lg border border-neutral-200 p-4 hover:border-neutral-400"
            >
              <h3 className="font-semibold">{project.title}</h3>
              <p className="mt-1 text-sm text-neutral-500">{project.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded bg-neutral-100 px-2 py-1 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="skills">
        <h2 className="text-2xl font-semibold">Skills</h2>
        <div className="mt-6 flex flex-col gap-4">
          {SKILLS.map((group) => (
            <div key={group.category}>
              <h3 className="font-semibold">{group.category}</h3>
              <p className="mt-1 text-sm text-neutral-500">{group.items.join(", ")}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact">
        <h2 className="text-2xl font-semibold">Contact</h2>
        <div className="mt-6 flex flex-col gap-2 text-sm">
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <a href={CONTACT.github}>{CONTACT.github}</a>
          <a href={CONTACT.linkedin}>{CONTACT.linkedin}</a>
        </div>
      </section>
    </main>
  );
}
