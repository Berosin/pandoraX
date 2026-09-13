import type { ArtifactMetadata } from "@/types/artifact";

export const rippleSceneMeta: ArtifactMetadata = {
  id: "ripple-scene",
  name: "Ripple Scene",
  slug: "ripple-scene",
  description:
    "A finely-subdivided plane that ripples outward from wherever you click or drag, with a subtle pointer-driven tilt.",
  category: "Cursor",
  technologies: ["React", "TypeScript", "Three.js", "React Three Fiber", "WebGL", "GLSL"],
  difficulty: "Advanced",
  renderMode: "isolated",

  entry: "index.tsx",
  files: [
    { path: "index.tsx", language: "tsx", isEntry: true },
    { path: "Scene.tsx", language: "tsx" },
    { path: "shaders.ts", language: "ts" },
  ],
  dependencies: ["react", "three", "@react-three/fiber"],

  configurable: true,
  configSchema: {
    color: {
      type: "color",
      default: "#4fb8c9",
      label: "Surface color",
      group: "Appearance",
    },
    rippleStrength: {
      type: "number",
      min: 0,
      max: 1,
      step: 0.05,
      default: 0.4,
      label: "Ripple strength",
      group: "Interaction",
    },
    mouseInfluence: {
      type: "number",
      min: 0,
      max: 2,
      step: 0.1,
      default: 1,
      label: "Mouse influence",
      group: "Interaction",
      description: "How strongly the pointer tilts the surface.",
    },
    waveSpeed: {
      type: "number",
      min: 0,
      max: 3,
      step: 0.1,
      default: 1.2,
      label: "Ambient wave speed",
      group: "Animation",
    },
    autoRipple: {
      type: "boolean",
      default: true,
      label: "Idle ripples",
      group: "Animation",
      description: "Spawns a ripple at a random point every couple of seconds when idle.",
    },
  },
  configPresets: [
    {
      name: "Default",
      description: "Resets every option to its shipped default.",
      values: {},
    },
    {
      name: "Still pond",
      description: "No idle ripples, gentle strength — reacts only to you.",
      values: { autoRipple: false, rippleStrength: 0.25, waveSpeed: 0.4 },
    },
    {
      name: "Energetic",
      description: "Strong ripples, frequent idle activity, faster ambient waves.",
      values: { rippleStrength: 0.8, waveSpeed: 2, mouseInfluence: 1.6 },
    },
  ],

  performance: {
    impact: "Moderate",
    gpuIntensive: true,
    notes:
      "A ~10,000-vertex plane displaced in a vertex shader every frame. Segment count drops on mobile. Unmounts off-screen (see PreviewFrame).",
  },
  browserRequirements: ["WebGL support"],
  requiresWebGL: true,
  mobileSupport: "reduced",

  license: "MIT",
  author: "PandoraX",
  version: "0.1.0",
};
