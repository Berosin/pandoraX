import type { ArtifactDefinition } from "@/types/artifact";
import DragSnapCard from "./index";

export const dragSnapCard: ArtifactDefinition = {
  id: "drag-snap-card",
  name: "Drag Snap Card",
  slug: "drag-snap-card",
  description:
    "Drag the card — mouse or touch — and let go. GSAP eases it back to center with an elastic snap.",
  category: "Interactions",
  technologies: ["React", "TypeScript", "GSAP"],
  difficulty: "Intermediate",
  renderMode: "isolated",

  entry: "index.tsx",
  files: [
    { path: "index.tsx", language: "tsx", isEntry: true },
    { path: "README.md", language: "md" },
  ],
  dependencies: ["react", "gsap"],

  configurable: true,
  configSchema: {
    color: {
      type: "color",
      default: "#c2935f",
      label: "Card color",
    },
  },

  performance: {
    impact: "Low",
    notes: "Idle until dragged; GSAP handles the single release tween.",
  },
  browserRequirements: ["Pointer Events support (universal in modern browsers)"],

  license: "MIT",
  author: "PandoraX",
  version: "0.1.0",
  featured: true,

  component: DragSnapCard,
};