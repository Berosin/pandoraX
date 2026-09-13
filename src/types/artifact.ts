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
  /** Groups related controls into a labeled section in the generated
   * panel — e.g. "Appearance", "Animation", "Interaction". Fields
   * without a group are collected under a shared default section.
   * Purely a presentation hint; doesn't affect validation or values. */
  group?: string;
}

/** A single control in an artifact's configuration schema (see §15). */
export type ArtifactConfigField =
  | (ArtifactConfigFieldBase & {
      type: "number";
      min: number;
      max: number;
      step: number;
      default: number;
      /** Short unit suffix shown next to the live value, e.g. "px", "ms", "°". */
      unit?: string;
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

/**
 * A named, one-click combination of config values — e.g. "Subtle" /
 * "Dramatic" — surfaced as quick-apply chips above an artifact's
 * generated controls. Only the keys a preset cares about need to be
 * set; applying one resolves the rest from the schema's own defaults.
 */
export interface ArtifactConfigPreset {
  name: string;
  description?: string;
  values: Partial<ArtifactConfigValues>;
}

/** A binary/static asset (texture, image, font, model) an artifact ships
 * with. Unlike ArtifactFile, these aren't loaded as text — they're served
 * through the artifact assets route and referenced by URL at runtime. */
export interface ArtifactAsset {
  /** Path relative to the artifact's own assets/ folder, e.g. "texture.png". */
  path: string;
  description?: string;
}

export type PerformanceImpact = "Low" | "Moderate" | "High";

/** A brief, honest performance characterization — shown on the detail
 * page's metadata panel. Not a benchmark, just a heads-up. */
export interface ArtifactPerformance {
  impact: PerformanceImpact;
  notes?: string;
  /** True if this artifact does real per-frame GPU work (a live WebGL
   * context, a shader pass, a particle system) rather than occasional
   * DOM/CSS updates — surfaced as its own badge, since "High impact"
   * alone doesn't distinguish "animates a lot of DOM nodes" from
   * "renders a 3D scene every frame". */
  gpuIntensive?: boolean;
}

/** How well an artifact is expected to hold up on phones/tablets.
 * "reduced" means the artifact itself scales detail down there (see
 * lib/use-device-capabilities.ts) rather than being hidden outright. */
export type MobileSupport = "full" | "reduced" | "unsupported";

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
  /** Optional quick-apply presets built from the same schema — see
   * ArtifactConfigPreset. Only meaningful when configSchema is set. */
  configPresets?: ArtifactConfigPreset[];

  performance: ArtifactPerformance;
  browserRequirements: string[];
  /** True if this artifact needs a live WebGL context to render at all
   * (as opposed to Canvas2D/DOM/CSS) — used for the "WebGL required"
   * badge and lets a future capability check decide whether to even
   * attempt mounting it. */
  requiresWebGL?: boolean;
  /** Defaults to "full" when omitted — every artifact from before this
   * field existed keeps behaving exactly as it did. */
  mobileSupport?: MobileSupport;

  license: string;
  author: string;
  version: string;

  /** Surfaced on the landing page's Featured Artifacts section. */
  featured?: boolean;
}

/**
 * A fully registered artifact. Used to additionally carry a directly
 * embedded `component` reference; as of the Phase 12 performance pass,
 * live components are resolved separately — by slug, through a small
 * client-side lookup table (see
 * components/preview/artifact-components.tsx) — so that importing this
 * type, and the registry built from it, never pulls in any artifact's
 * actual dependencies (Three.js, GSAP, etc.). Kept as its own alias
 * rather than just using ArtifactMetadata everywhere so call sites that
 * conceptually want "a full artifact" don't need to change if this
 * ever grows a new field beyond plain metadata again.
 */
export type ArtifactDefinition = ArtifactMetadata;