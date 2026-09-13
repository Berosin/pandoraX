import type { ArtifactDefinition } from "@/types/artifact";

/**
 * Builds the URL for a binary asset an artifact ships with (texture,
 * image, font, model). Assets are served through the artifact assets
 * route rather than the public/ folder, so each artifact's bundle stays
 * self-contained under src/artifacts/<slug>/ — source, config and
 * assets together, ready for the future ZIP export.
 */
export function getArtifactAssetUrl(
  artifact: Pick<ArtifactDefinition, "slug">,
  assetPath: string
): string {
  return `/api/artifacts/${artifact.slug}/assets/${assetPath}`;
}