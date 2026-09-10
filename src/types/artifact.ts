import type { ComponentType } from "react";

/**
 * The categories artifacts are organized under across the site
 * (landing page category tiles, /artifacts filters, etc).
 */
export const ARTIFACT_CATEGORIES = [
  "Motion",
  "3D",
  "WebGL",
  "Shaders",
  "Cursor",
  "Scroll",
  "Text",
  "Backgrounds",
  "Interactions",
  "Experimental",
] as const;

export type ArtifactCategory = (typeof ARTIFACT_CATEGORIES)[number];

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

/**
 * How an artifact's live preview should be mounted.
 *
 * - "direct"   — rendered straight into the gallery/detail page tree.
 *                Safe for lightweight DOM/CSS/Motion artifacts.
 * - "isolated" — rendered inside a sandboxed preview boundary (its own
 *                error boundary + cleanup lifecycle). Required for
 *                Three.js/WebGL/GSAP-heavy artifacts so a crash, a
 *                leaked context or a stray global can't take down the
 *                rest of the app. See components/preview/PreviewFrame.
 */
export type ArtifactRenderMode = "direct" | "isolated";

export type CodeLanguage =
  | "tsx"
  | "ts"
  | "jsx"
  | "js"
  | "css"
  | "glsl"
  | "json"
  | "html"
  | "md"
  | "txt";

/** A single file that belongs to an artifact's source bundle. */
export interface ArtifactFile {
  /** Path relative to the artifact's own folder, e.g. "shaders/vertex.glsl". */
  path: string;
  language: CodeLanguage;
  /** Marks the file users should look at first in the code viewer. */
  isEntry?: boolean;
}

interface ArtifactConfigFieldBase {
  /** Human-readable label for the generated control. Falls back to the key. */
  label?: string;
  description?: string;
}

/** A single control in an artifact's configuration schema (see §15). */
export type ArtifactConfigField =
  | (ArtifactConfigFieldBase & {
      type: "number";
      min: number;
      max: number;
      step: number;
      default: number;
    })
  | (ArtifactConfigFieldBase & { type: "color"; default: string })
  | (ArtifactConfigFieldBase & { type: "boolean"; default: boolean })
  | (ArtifactConfigFieldBase & {
      type: "select";
      options: string[];
      default: string;
    })
  | (ArtifactConfigFieldBase & { type: "text"; default: string });

/** Keyed by the prop name the value maps to on the artifact's component. */
export type ArtifactConfigSchema = Record<string, ArtifactConfigField>;

/** Values resolved from an ArtifactConfigSchema (defaults or overrides). */
export type ArtifactConfigValues = Record<
  string,
  number | string | boolean
>;

/** A binary/static asset (texture, image, font, model) an artifact ships
 * with. Unlike ArtifactFile, these aren't loaded as text — they're served
 * through the artifact assets route and referenced by URL at runtime. */
export interface ArtifactAsset {
  /** Path relative to the artifact's own assets/ folder, e.g. "texture.png". */
  path: string;
  description?: string;
}

/**
 * The static metadata every artifact registers with the platform.
 * This is the shape referenced throughout the spec (§13) — the gallery,
 * search, detail page, code viewer and downloader all read from this
 * without knowing anything artifact-specific.
 */
export interface ArtifactMetadata {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ArtifactCategory;
  technologies: ArtifactTechnology[];
  difficulty: ArtifactDifficulty;
  renderMode: ArtifactRenderMode;

  /** Entry file, relative to the artifact folder — e.g. "index.tsx". */
  entry: string;
  files: ArtifactFile[];
  assets?: ArtifactAsset[];
  dependencies: string[];

  configurable: boolean;
  configSchema?: ArtifactConfigSchema;

  license: string;
  author: string;
  version: string;

  /** Surfaced on the landing page's Featured Artifacts section. */
  featured?: boolean;
}

/**
 * A fully registered artifact: metadata plus the live component used
 * for direct/isolated preview rendering. Artifact authors export this
 * shape from their `artifact.config.ts`; nothing else in the platform
 * needs to change when a new one is added.
 */
export interface ArtifactDefinition extends ArtifactMetadata {
  component: ComponentType<Partial<ArtifactConfigValues>>;
}