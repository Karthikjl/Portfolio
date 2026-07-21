"use client";

import { motion } from "framer-motion";

const domains = [
  {
    title: "Web Development",
    description:
      "Building fast, accessible, full-stack products — from React/Next.js frontends to the APIs and databases behind them.",
  },
  {
    title: "AI / Automation & Agents",
    description:
      "Designing LLM-powered agents and low-code automations that connect tools and remove repetitive manual work.",
  },
];

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-heading text-3xl font-bold"
      >
        About
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="mt-4 max-w-2xl text-foreground/70"
      >
        I&apos;m a developer who works across the full stack and in AI/automation —
        equally comfortable shipping a product UI or wiring up an agent pipeline.
      </motion.p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {domains.map((domain, index) => (
          <motion.div
            key={domain.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 * index }}
            className="rounded-2xl border border-foreground/10 p-6"
          >
            <h3 className="font-heading text-xl font-semibold">{domain.title}</h3>
            <p className="mt-2 text-foreground/70">{domain.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
