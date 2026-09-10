import type { ArtifactDefinition } from "@/types/artifact";
import MagneticButton from "./index";

export const magneticButton: ArtifactDefinition = {
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
    strength: {
      type: "number",
      min: 0,
      max: 1,
      step: 0.05,
      default: 0.4,
      label: "Magnetic strength",
    },
    color: {
      type: "color",
      default: "#b98550",
      label: "Accent color",
    },
  },

  license: "MIT",
  author: "PandoraX",
  version: "0.1.0",
  featured: true,

  component: MagneticButton,
};
