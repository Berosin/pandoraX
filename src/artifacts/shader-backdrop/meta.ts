import type { ArtifactMetadata } from "@/types/artifact";

export const shaderBackdropMeta: ArtifactMetadata = {
  id: "shader-backdrop",
  name: "Shader Backdrop",
  slug: "shader-backdrop",
  description:
    "A full-bleed, domain-warped GLSL gradient — raw WebGL2, no Three.js, managed and cleaned up by hand.",
  category: "Backgrounds",
  technologies: ["TypeScript", "WebGL", "GLSL", "Canvas"],
  difficulty: "Advanced",
  renderMode: "isolated",

  entry: "index.tsx",
  files: [
    { path: "index.tsx", language: "tsx", isEntry: true },
    { path: "shaders.ts", language: "ts" },
    { path: "webgl-utils.ts", language: "ts" },
  ],
  dependencies: ["react"],

  configurable: true,
  configSchema: {
    colorA: {
      type: "color",
      default: "#1b1240",
      label: "Color A",
      group: "Appearance",
    },
    colorB: {
      type: "color",
      default: "#6c3fd1",
      label: "Color B",
      group: "Appearance",
    },
    speed: {
      type: "number",
      min: 0,
      max: 1.5,
      step: 0.05,
      default: 0.25,
      label: "Flow speed",
      group: "Animation",
    },
    scale: {
      type: "number",
      min: 0.4,
      max: 4,
      step: 0.1,
      default: 1.4,
      label: "Noise scale",
      group: "Appearance",
    },
    warp: {
      type: "number",
      min: 0,
      max: 1.5,
      step: 0.05,
      default: 0.6,
      label: "Distortion",
      group: "Appearance",
    },
  },
  configPresets: [
    {
      name: "Default",
      description: "Resets every option to its shipped default.",
      values: {},
    },
    {
      name: "Calm ink",
      description: "Slow, low-distortion, muted violet.",
      values: { speed: 0.08, warp: 0.2, colorA: "#150f2e", colorB: "#3d2a70" },
    },
    {
      name: "Solar",
      description: "Warm amber and rose, faster flow.",
      values: { colorA: "#2b0f0f", colorB: "#e0793c", speed: 0.45, warp: 0.8 },
    },
    {
      name: "Deep sea",
      description: "Cool teal, heavy distortion.",
      values: { colorA: "#031418", colorB: "#1c8a86", warp: 1.2, scale: 2 },
    },
  ],

  performance: {
    impact: "Moderate",
    gpuIntensive: true,
    notes:
      "A raw WebGL2 fragment shader redrawn every frame across the full canvas. Time stops advancing when the browser reports a reduced-motion preference. Unmounts off-screen (see PreviewFrame).",
  },
  browserRequirements: ["WebGL support"],
  requiresWebGL: true,
  mobileSupport: "reduced",

  license: "MIT",
  author: "PandoraX",
  version: "0.1.0",
};
