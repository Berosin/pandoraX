import type { ArtifactDefinition } from "@/types/artifact";
import { magneticButton } from "./magnetic-button/artifact.config";
import { textReveal } from "./text-reveal/artifact.config";

/**
 * The full artifact catalog. Adding a new artifact means creating its
 * folder under src/artifacts/<slug>/, exporting an ArtifactDefinition
 * from its artifact.config.ts, and adding it to this array — the
 * gallery, search, detail page, code viewer and downloader all
 * consume this list without any further changes.
 */
export const artifacts: ArtifactDefinition[] = [magneticButton, textReveal];
