import type { ArtifactDefinition } from "@/types/artifact";
import AuroraGlobe from "./index";

export const auroraGlobe: ArtifactDefinition = {
  id: "aurora-globe",
  name: "Aurora Globe",
  slug: "aurora-globe",
  description:
    "A noise-shaded sphere of drifting aurora color. Canvas2D today — the WebGL version ships with the 3D rendering engine.",
  category: "Experimental",
  technologies: ["React", "TypeScript", "Canvas"],
  difficulty: "Intermediate",
  renderMode: "isolated",

  entry: "index.tsx",
  files: [
    { path: "index.tsx", language: "tsx", isEntry: true },
    { path: "Globe.tsx", language: "tsx" },
    { path: "shaders/vertex.glsl", language: "glsl" },
    { path: "shaders/fragment.glsl", language: "glsl" },
    { path: "utils/noise.ts", language: "ts" },
    { path: "README.md", language: "md" },
    { path: "package.json", language: "json" },
    { path: "LICENSE.md", language: "md" },
  ],
  assets: [
    {
      path: "texture.png",
      description: "Backdrop texture behind the noise-shaded globe.",
    },
  ],
  dependencies: ["react"],

  configurable: true,
  configSchema: {
    colorA: {
      type: "color",
      default: "#3aa88c",
      label: "Primary color",
    },
    colorB: {
      type: "color",
      default: "#7859c8",
      label: "Secondary color",
    },
    speed: {
      type: "number",
      min: 0.02,
      max: 0.3,
      step: 0.01,
      default: 0.08,
      label: "Drift speed",
    },
  },

  license: "MIT",
  author: "PandoraX",
  version: "0.1.0",
  featured: true,

  component: AuroraGlobe,
};