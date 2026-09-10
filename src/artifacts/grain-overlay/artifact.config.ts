import type { ArtifactDefinition } from "@/types/artifact";
import GrainOverlay from "./index";

export const grainOverlay: ArtifactDefinition = {
  id: "grain-overlay",
  name: "Grain Overlay",
  slug: "grain-overlay",
  description:
    "A constant low-alpha film-grain wash, redrawn every frame. The simplest possible artifact: one file, no dependencies beyond React.",
  category: "Backgrounds",
  technologies: ["React", "TypeScript", "Canvas"],
  difficulty: "Beginner",
  renderMode: "direct",

  entry: "index.tsx",
  files: [{ path: "index.tsx", language: "tsx", isEntry: true }],
  dependencies: ["react"],

  configurable: false,

  license: "MIT",
  author: "PandoraX",
  version: "0.1.0",

  component: GrainOverlay,
};