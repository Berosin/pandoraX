import type { ArtifactDefinition } from "@/types/artifact";
import { magneticButton } from "./magnetic-button/artifact.config";
import { textReveal } from "./text-reveal/artifact.config";
import { auroraGlobe } from "./aurora-globe/artifact.config";
import { grainOverlay } from "./grain-overlay/artifact.config";
import { dragSnapCard } from "./drag-snap-card/artifact.config";
import { shaderSphere } from "./shader-sphere/artifact.config";
import { crystalGem } from "./crystal-gem/artifact.config";
import { particleField } from "./particle-field/artifact.config";
import { shaderBackdrop } from "./shader-backdrop/artifact.config";
import { rippleScene } from "./ripple-scene/artifact.config";
import { threejsEnvironment } from "./threejs-environment/artifact.config";

/**
 * The full artifact catalog. Adding a new artifact means creating its
 * folder under src/artifacts/<slug>/, exporting an ArtifactDefinition
 * from its artifact.config.ts, and adding it to this array — the
 * gallery, search, detail page, code viewer and downloader all
 * consume this list without any further changes.
 */
export const artifacts: ArtifactDefinition[] = [
  magneticButton,
  textReveal,
  auroraGlobe,
  grainOverlay,
  dragSnapCard,
  shaderSphere,
  crystalGem,
  particleField,
  shaderBackdrop,
  rippleScene,
  threejsEnvironment,
];