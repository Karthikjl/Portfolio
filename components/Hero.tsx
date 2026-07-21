"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-background to-accent/10" />,
});

export default function Hero() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  const textContainer = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };
  const textItem = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        style={{ opacity, scale }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {prefersReducedMotion ? (
          <div className="absolute inset-0 bg-gradient-to-br from-background to-accent/10" />
        ) : (
          <HeroScene />
        )}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 45%, var(--background) 100%)",
          }}
        />
      </motion.div>
      <motion.div
        className="relative z-10 mx-auto max-w-6xl px-6"
        variants={textContainer}
        initial="hidden"
        animate="show"
      >
        <motion.p
          variants={textItem}
          className="mb-3 text-sm font-medium uppercase tracking-widest text-accent"
        >
          Developer
        </motion.p>
        <motion.h1
          variants={textItem}
          className="font-heading max-w-2xl text-5xl font-bold leading-tight sm:text-6xl"
        >
          Full-stack &amp; AI/automation developer
        </motion.h1>
        <motion.p variants={textItem} className="mt-4 max-w-lg text-lg text-foreground/70">
          I build web products and AI-driven automations, end to end.
        </motion.p>
      </motion.div>
    </section>
  );
}
