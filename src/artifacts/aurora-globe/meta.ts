import type { ArtifactMetadata } from "@/types/artifact";

export const auroraGlobeMeta: ArtifactMetadata = {
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
  configPresets: [
    {
      name: "Default",
      description: "Resets every option to its shipped default.",
      values: {},
    },
    {
      name: "Minimal",
      description: "Muted, low-contrast tones with a barely-there drift.",
      values: { colorA: "#8c8478", colorB: "#c9bda3", speed: 0.03 },
    },
    {
      name: "Midnight",
      description: "Deep navy and muted blue, slow and nocturnal.",
      values: { colorA: "#1b2a4a", colorB: "#3a4d7a", speed: 0.05 },
    },
    {
      name: "Aurora",
      description: "A brighter take on the classic aurora green and violet.",
      values: { colorA: "#2ee6a6", colorB: "#9b6df0", speed: 0.12 },
    },
    {
      name: "Cosmic",
      description: "Magenta and deep purple, fast and energetic.",
      values: { colorA: "#e06bd6", colorB: "#4b2fae", speed: 0.22 },
    },
  ],

  performance: {
    impact: "Moderate",
    notes:
      "Redraws a small internal noise buffer every frame while visible. Unmounts off-screen (see PreviewFrame).",
  },
  browserRequirements: ["Canvas2D support (universal in modern browsers)"],

  license: "MIT",
  author: "PandoraX",
  version: "0.1.0",
  featured: true,
};
