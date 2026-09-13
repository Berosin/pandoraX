import type { ArtifactMetadata } from "@/types/artifact";

export const shaderSphereMeta: ArtifactMetadata = {
  id: "shader-sphere",
  name: "Shader Sphere",
  slug: "shader-sphere",
  description:
    "A faceted sphere lit entirely by a custom GLSL shader — fresnel rim light, a drifting color wave, pointer-reactive tilt.",
  category: "3D",
  technologies: ["React", "Three.js", "React Three Fiber", "WebGL", "GLSL"],
  difficulty: "Advanced",
  renderMode: "isolated",

  entry: "index.tsx",
  files: [
    { path: "index.tsx", language: "tsx", isEntry: true },
    { path: "Scene.tsx", language: "tsx" },
    { path: "shaders.ts", language: "ts" },
    { path: "README.md", language: "md" },
  ],
  dependencies: ["react", "three", "@react-three/fiber"],

  configurable: true,
  configSchema: {
    colorA: {
      type: "color",
      default: "#3aa88c",
      label: "Primary color",
      group: "Appearance",
    },
    colorB: {
      type: "color",
      default: "#7859c8",
      label: "Secondary color",
      group: "Appearance",
    },
    glowIntensity: {
      type: "number",
      min: 0,
      max: 2,
      step: 0.05,
      default: 0.9,
      label: "Rim glow",
      group: "Appearance",
      description: "Fresnel rim-light strength.",
    },
    rotationSpeed: {
      type: "number",
      min: 0,
      max: 1,
      step: 0.02,
      default: 0.15,
      label: "Rotation speed",
      group: "Animation",
    },
    waveSpeed: {
      type: "number",
      min: 0,
      max: 4,
      step: 0.1,
      default: 1.4,
      label: "Wave speed",
      group: "Animation",
      description: "How fast the color wave travels across the surface.",
    },
    autoRotate: {
      type: "boolean",
      default: true,
      label: "Auto-rotate",
      group: "Animation",
      description: "Idle spin when the pointer isn't over the sphere.",
    },
    mouseInfluence: {
      type: "number",
      min: 0,
      max: 2,
      step: 0.1,
      default: 1,
      label: "Mouse influence",
      group: "Interaction",
      description: "How strongly the pointer tilts and nudges the sphere.",
    },
  },
  configPresets: [
    {
      name: "Default",
      description: "Resets every option to its shipped default.",
      values: {},
    },
    {
      name: "Calm",
      description: "Slow drift, soft glow, gentle response to the pointer.",
      values: {
        rotationSpeed: 0.05,
        waveSpeed: 0.6,
        glowIntensity: 0.6,
        mouseInfluence: 0.5,
        autoRotate: true,
      },
    },
    {
      name: "Vivid",
      description: "The shipped defaults — balanced motion and glow.",
      values: {
        rotationSpeed: 0.15,
        waveSpeed: 1.4,
        glowIntensity: 0.9,
        mouseInfluence: 1,
        autoRotate: true,
      },
    },
    {
      name: "Chaotic",
      description: "Fast wave and spin, strong glow, no idle rotation — driven entirely by the pointer.",
      values: {
        rotationSpeed: 0.6,
        waveSpeed: 3.2,
        glowIntensity: 1.6,
        mouseInfluence: 1.8,
        autoRotate: false,
      },
    },
  ],

  performance: {
    impact: "Moderate",
    notes:
      "Runs a live WebGL context and a per-frame shader pass. Unmounts off-screen to limit GPU usage (see PreviewFrame).",
  },
  browserRequirements: ["WebGL support"],

  license: "MIT",
  author: "PandoraX",
  version: "0.1.0",
  featured: true,
};
