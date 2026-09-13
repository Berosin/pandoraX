import type { ArtifactMetadata } from "@/types/artifact";

export const textRevealMeta: ArtifactMetadata = {
  id: "text-reveal",
  name: "Text Reveal",
  slug: "text-reveal",
  description:
    "Staggered per-character entrance animation, driven by Motion.",
  category: "Text",
  technologies: ["React", "TypeScript", "Motion"],
  difficulty: "Beginner",
  renderMode: "direct",

  entry: "index.tsx",
  files: [
    { path: "index.tsx", language: "tsx", isEntry: true },
    { path: "splitText.ts", language: "ts" },
  ],
  dependencies: ["react", "motion"],

  configurable: true,
  configSchema: {
    text: {
      type: "text",
      default: "PandoraX",
      label: "Text",
    },
    stagger: {
      type: "number",
      min: 0,
      max: 0.2,
      step: 0.01,
      default: 0.04,
      label: "Stagger delay",
    },
    color: {
      type: "color",
      default: "#f3e1c3",
      label: "Color",
    },
  },

  performance: {
    impact: "Low",
    notes: "A handful of small Motion-driven elements, animated once on mount.",
  },
  browserRequirements: ["Any modern browser"],

  license: "MIT",
  author: "PandoraX",
  version: "0.1.0",
  featured: true,
};
