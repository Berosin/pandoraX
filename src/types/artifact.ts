export const ARTIFACT_DIFFICULTIES = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Experimental",
] as const;

export type ArtifactDifficulty = (typeof ARTIFACT_DIFFICULTIES)[number];

/**
 * Technologies a given artifact is built with. Rendered as badges on
 * cards and detail pages, and used to compute install instructions.
 * A superset of ARTIFACT_TECHNOLOGIES below — every artifact's actual
 * tags must come from this union, but the filter UI only exposes the
 * canonical subset.
 */
export type ArtifactTechnology =
  | "React"
  | "Next.js"
  | "TypeScript"
  | "CSS"
  | "Motion"
  | "GSAP"
  | "Three.js"
  | "React Three Fiber"
  | "React Three Drei"
  | "WebGL"
  | "GLSL"
  | "Canvas";

/** The canonical technology list surfaced in the /artifacts filter UI. */
export const ARTIFACT_TECHNOLOGIES: ArtifactTechnology[] = [
  "React",
  "Next.js",
  "Motion",
  "GSAP",
  "Three.js",
  "React Three Fiber",
  "WebGL",
  "GLSL",
];