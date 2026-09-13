import type { ArtifactMetadata } from "@/types/artifact";

export const threejsEnvironmentMeta: ArtifactMetadata = {
  id: "threejs-environment",
  name: "Three.js Environment",
  slug: "threejs-environment",
  description:
    "A small floating crystal cluster loaded from a real glTF file, set in a starfield with fog, orbiting lights, an interactive camera, and bloom.",
  category: "3D",
  technologies: [
    "React",
    "TypeScript",
    "Three.js",
    "React Three Fiber",
    "React Three Drei",
    "WebGL",
  ],
  difficulty: "Experimental",
  renderMode: "isolated",

  entry: "index.tsx",
  files: [
    { path: "index.tsx", language: "tsx", isEntry: true },
    { path: "Scene.tsx", language: "tsx" },
    { path: "CrystalModel.tsx", language: "tsx" },
    { path: "grid-texture.ts", language: "ts" },
  ],
  assets: [
    {
      path: "crystals.glb",
      description:
        "A small five-mesh crystal cluster, procedurally generated and hand-serialized to binary glTF (see the README).",
    },
  ],
  dependencies: [
    "react",
    "three",
    "@react-three/fiber",
    "@react-three/drei",
    "@react-three/postprocessing",
  ],

  configurable: true,
  configSchema: {
    pointLightColor: {
      type: "color",
      default: "#8b7cf6",
      label: "Light color",
      group: "Lighting",
    },
    ambientIntensity: {
      type: "number",
      min: 0,
      max: 1.5,
      step: 0.05,
      default: 0.5,
      label: "Ambient light",
      group: "Lighting",
    },
    autoRotate: {
      type: "boolean",
      default: true,
      label: "Auto-rotate camera",
      group: "Animation",
    },
    starCount: {
      type: "number",
      min: 200,
      max: 3000,
      step: 100,
      default: 1200,
      label: "Star count",
      group: "Environment",
      description: "Capped lower automatically on touch/narrow devices.",
    },
    bloomIntensity: {
      type: "number",
      min: 0,
      max: 3,
      step: 0.1,
      default: 1.2,
      label: "Bloom intensity",
      group: "Post-processing",
      description: "Disabled entirely on mobile/low-power devices.",
    },
    bloomThreshold: {
      type: "number",
      min: 0,
      max: 1,
      step: 0.05,
      default: 0.4,
      label: "Bloom threshold",
      group: "Post-processing",
    },
  },
  configPresets: [
    {
      name: "Default",
      description: "Resets every option to its shipped default.",
      values: {},
    },
    {
      name: "Dim & still",
      description: "Low light, no bloom pressure, camera doesn't auto-rotate.",
      values: { ambientIntensity: 0.25, bloomIntensity: 0.4, autoRotate: false },
    },
    {
      name: "Radiant",
      description: "Bright lighting and a strong bloom glow.",
      values: { ambientIntensity: 0.8, bloomIntensity: 2.2, bloomThreshold: 0.2 },
    },
  ],

  performance: {
    impact: "High",
    gpuIntensive: true,
    notes:
      "A full scene: a loaded glTF model, a starfield, fog, orbiting lights and a multi-pass bloom effect. Post-processing is skipped entirely on mobile/low-power devices. Unmounts off-screen (see PreviewFrame).",
  },
  browserRequirements: ["WebGL support"],
  requiresWebGL: true,
  mobileSupport: "reduced",

  license: "MIT",
  author: "PandoraX",
  version: "0.1.0",
  featured: true,
};
