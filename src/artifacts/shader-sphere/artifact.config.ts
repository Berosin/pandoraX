import type { ArtifactDefinition } from "@/types/artifact";
import ShaderSphere from "./index";

export const shaderSphere: ArtifactDefinition = {
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
    },
    colorB: {
      type: "color",
      default: "#7859c8",
      label: "Secondary color",
    },
  },

  license: "MIT",
  author: "PandoraX",
  version: "0.1.0",
  featured: true,

  component: ShaderSphere,
};