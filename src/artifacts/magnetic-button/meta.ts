import type { ArtifactMetadata } from "@/types/artifact";

export const magneticButtonMeta: ArtifactMetadata = {
  id: "magnetic-button",
  name: "Magnetic Button",
  slug: "magnetic-button",
  description:
    "A button that pulls toward the cursor within its bounds, then eases back to rest.",
  category: "Motion",
  technologies: ["React", "TypeScript", "CSS"],
  difficulty: "Beginner",
  renderMode: "direct",

  entry: "index.tsx",
  files: [
    { path: "index.tsx", language: "tsx", isEntry: true },
    { path: "useMagnetic.ts", language: "ts" },
  ],
  dependencies: ["react"],

  configurable: true,
  configSchema: {
    color: {
      type: "color",
      default: "#b98550",
      label: "Accent color",
      group: "Appearance",
    },
    radius: {
      type: "number",
      min: 0,
      max: 999,
      step: 1,
      default: 999,
      unit: "px",
      label: "Corner radius",
      group: "Appearance",
      description: "999 renders as a full pill.",
    },
    glow: {
      type: "boolean",
      default: false,
      label: "Glow",
      group: "Appearance",
      description: "Adds a soft shadow in the accent color.",
    },
    fontSize: {
      type: "number",
      min: 11,
      max: 20,
      step: 1,
      default: 14,
      unit: "px",
      label: "Label size",
      group: "Typography",
    },
    duration: {
      type: "number",
      min: 80,
      max: 600,
      step: 10,
      default: 200,
      unit: "ms",
      label: "Return duration",
      group: "Animation",
    },
    easing: {
      type: "select",
      options: ["ease-out", "ease-in-out", "linear", "back"],
      default: "ease-out",
      label: "Easing",
      group: "Animation",
    },
    strength: {
      type: "number",
      min: 0,
      max: 1,
      step: 0.05,
      default: 0.4,
      label: "Magnetic strength",
      group: "Interaction",
      description: "How strongly the button follows the pointer.",
    },
  },
  configPresets: [
    {
      name: "Default",
      description: "Resets every option to its shipped default.",
      values: {},
    },
    {
      name: "Subtle",
      description: "A gentle pull that settles quickly, no glow.",
      values: { strength: 0.2, duration: 150, easing: "ease-out", glow: false },
    },
    {
      name: "Snappy",
      description: "Fast, linear response — no easing curve.",
      values: { strength: 0.5, duration: 120, easing: "linear", glow: false },
    },
    {
      name: "Dramatic",
      description: "A strong pull with an elastic, glowing return.",
      values: { strength: 0.8, duration: 420, easing: "back", glow: true, radius: 16 },
    },
  ],

  performance: {
    impact: "Low",
    notes: "A single CSS transform driven by pointer position — negligible cost.",
  },
  browserRequirements: ["Any modern browser"],

  license: "MIT",
  author: "PandoraX",
  version: "0.1.0",
  featured: true,
};
