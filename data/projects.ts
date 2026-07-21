export type Project = {
  title: string;
  description: string;
  tags: string[];
  link: string;
  imageAlt: string;
};

export const projects: Project[] = [
  {
    title: "Realtime Analytics Dashboard",
    description:
      "A full-stack dashboard for visualizing live product metrics, built with a Next.js frontend and a Node/Postgres backend.",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
    link: "https://github.com/",
    imageAlt: "Dashboard UI mockup",
  },
  {
    title: "AI Support Agent Pipeline",
    description:
      "An LLM-powered agent that triages support tickets, calls internal tools, and escalates edge cases to a human reviewer.",
    tags: ["LLM Agents", "Python", "Vector Search"],
    link: "https://github.com/",
    imageAlt: "Agent pipeline diagram",
  },
  {
    title: "No-Code Workflow Automations",
    description:
      "A set of low-code automations connecting CRM, email, and internal APIs to remove repetitive manual work.",
    tags: ["Automation", "APIs", "Low-Code"],
    link: "https://github.com/",
    imageAlt: "Workflow automation diagram",
  },
  {
    title: "E-commerce Storefront",
    description:
      "A performant storefront with server-rendered product pages, cart, and checkout, optimized for Core Web Vitals.",
    tags: ["Next.js", "Stripe", "Tailwind"],
    link: "https://github.com/",
    imageAlt: "Storefront UI mockup",
  },
];
