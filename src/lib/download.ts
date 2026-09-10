import type { ArtifactConfigValues, ArtifactDefinition } from "@/types/artifact";

/**
 * Reserved for Phase 2 (§22 — Download System).
 *
 * `buildArtifactArchive` will read an artifact's files via
 * `loadArtifactSource`, apply any config overrides to produce a
 * customized source export (§18), and package everything — source,
 * assets, package.json, README, LICENSE — into a downloadable ZIP.
 *
 * Defined now so the "Get Source" affordance has a real contract to
 * call into once JSZip (or similar) is wired up, instead of the UI
 * needing to change shape later.
 */
export interface DownloadRequest {
  artifact: ArtifactDefinition;
  configOverrides?: Partial<ArtifactConfigValues>;
}

export interface DownloadResult {
  filename: string;
  blob: Blob;
}

export async function buildArtifactArchive(
  _request: DownloadRequest
): Promise<DownloadResult> {
  throw new Error(
    "buildArtifactArchive is not implemented yet — ZIP export ships in Phase 2."
  );
}
