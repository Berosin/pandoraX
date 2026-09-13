import type { ArtifactMetadata } from "@/types/artifact";

export const particleFieldMeta: ArtifactMetadata = {
  id: "particle-field",
  name: "Particle Field",
  slug: "particle-field",
  description:
    "A GPU point-sprite cloud that drifts on a per-particle noise offset, computed entirely in a vertex shader.",
  category: "WebGL",
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
      default: "#6c9ceb",
      label: "Particle color",
      group: "Appearance",
    },
    particleSize: {
      type: "number",
      min: 0.5,
      max: 8,
      step: 0.1,
      default: 2.4,
      label: "Particle size",
      group: "Appearance",
    },
    speed: {
      type: "number",
      min: 0,
      max: 3,
      step: 0.05,
      default: 0.6,
      label: "Speed",
      group: "Animation",
    },
    particleCount: {
      type: "number",
      min: 100,
      max: 4000,
      step: 100,
      default: 1500,
      label: "Particle count",
      group: "Particles",
      description: "Capped lower automatically on touch/narrow devices.",
    },
    noiseScale: {
      type: "number",
      min: 0.2,
      max: 3,
      step: 0.1,
      default: 1,
      label: "Noise scale",
      group: "Particles",
    },
    turbulence: {
      type: "number",
      min: 0,
      max: 1.5,
      step: 0.05,
      default: 0.6,
      label: "Turbulence",
      group: "Particles",
    },
  },
  configPresets: [
    {
      name: "Default",
      description: "Resets every option to its shipped default.",
      values: {},
    },
    {
      name: "Calm dust",
      description: "Slow, fine, barely-drifting motes.",
      values: { speed: 0.2, turbulence: 0.25, particleSize: 1.6, particleCount: 1000 },
    },
    {
      name: "Dense storm",
      description: "Fast, turbulent, and thick with particles.",
      values: { speed: 1.6, turbulence: 1.2, particleCount: 3200, particleSize: 2 },
    },
    {
      name: "Violet swarm",
      description: "A purple, energetic cloud — matches the example in the docs.",
      values: { speed: 1.2, color: "#8b5cf6", turbulence: 0.9 },
    },
  ],

  performance: {
    impact: "High",
    gpuIntensive: true,
    notes:
      "Thousands of point sprites redrawn every frame in a live WebGL context. Particle count is capped further on mobile. Unmounts off-screen (see PreviewFrame).",
  },
  browserRequirements: ["WebGL support"],
  requiresWebGL: true,
  mobileSupport: "reduced",

  license: "MIT",
  author: "PandoraX",
  version: "0.1.0",
  featured: true,
};
