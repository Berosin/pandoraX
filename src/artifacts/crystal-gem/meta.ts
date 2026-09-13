import type { ArtifactMetadata } from "@/types/artifact";

export const crystalGemMeta: ArtifactMetadata = {
  id: "crystal-gem",
  name: "Crystal Gem",
  slug: "crystal-gem",
  description:
    "A faceted gem you can drag to spin, with physically-based material and a generated surface texture.",
  category: "3D",
  technologies: ["React", "TypeScript", "Three.js", "React Three Fiber", "React Three Drei", "WebGL"],
  difficulty: "Advanced",
  renderMode: "isolated",

  entry: "index.tsx",
  files: [
    { path: "index.tsx", language: "tsx", isEntry: true },
    { path: "Scene.tsx", language: "tsx" },
    { path: "facet-texture.ts", language: "ts" },
  ],
  dependencies: ["react", "three", "@react-three/fiber", "@react-three/drei"],

  configurable: true,
  configSchema: {
    color: {
      type: "color",
      default: "#8b7cf6",
      label: "Gem color",
      group: "Appearance",
    },
    metalness: {
      type: "number",
      min: 0,
      max: 1,
      step: 0.05,
      default: 0.4,
      label: "Metalness",
      group: "Appearance",
    },
    roughness: {
      type: "number",
      min: 0,
      max: 1,
      step: 0.05,
      default: 0.15,
      label: "Roughness",
      group: "Appearance",
    },
    autoRotate: {
      type: "boolean",
      default: true,
      label: "Auto-rotate",
      group: "Animation",
    },
    rotationSpeed: {
      type: "number",
      min: 0,
      max: 1.5,
      step: 0.05,
      default: 0.4,
      label: "Rotation speed",
      group: "Animation",
    },
    dragToRotate: {
      type: "boolean",
      default: true,
      label: "Drag to rotate",
      group: "Interaction",
      description: "Lets the pointer orbit the camera around the gem.",
    },
  },
  configPresets: [
    {
      name: "Default",
      description: "Resets every option to its shipped default.",
      values: {},
    },
    {
      name: "Amethyst",
      description: "Deep violet, glassy and still.",
      values: { color: "#7c5cf0", metalness: 0.1, roughness: 0.05, autoRotate: false },
    },
    {
      name: "Gold",
      description: "Warm, highly metallic, slow spin.",
      values: { color: "#e0b04a", metalness: 0.9, roughness: 0.3, rotationSpeed: 0.2 },
    },
    {
      name: "Obsidian",
      description: "Near-black, rough, fast spin.",
      values: { color: "#1c1a22", metalness: 0.2, roughness: 0.6, rotationSpeed: 0.9 },
    },
  ],

  performance: {
    impact: "Moderate",
    gpuIntensive: true,
    notes:
      "Live PBR lighting and a generated texture in a WebGL context. Unmounts off-screen to limit GPU usage (see PreviewFrame).",
  },
  browserRequirements: ["WebGL support"],
  requiresWebGL: true,
  mobileSupport: "reduced",

  license: "MIT",
  author: "PandoraX",
  version: "0.1.0",
  featured: true,
};
