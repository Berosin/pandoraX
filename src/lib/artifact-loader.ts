import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ArtifactMetadata, ArtifactFile } from "@/types/artifact";
import { highlightSource, type HighlightedLine } from "@/lib/syntax-highlight";

export const ARTIFACTS_ROOT = path.join(process.cwd(), "src", "artifacts");

export interface LoadedArtifactFile extends ArtifactFile {
  content: string;
  /** Pre-tokenized lines for the source viewer's syntax highlighting.
   * Computed once on the server so the client never ships a highlighter. */
  lines: HighlightedLine[];
}

/** Reads a single artifact source file off disk, relative to its folder,
 * and tokenizes it for the code viewer. */
export async function loadArtifactFile(
  artifact: ArtifactMetadata,
  file: ArtifactFile
): Promise<LoadedArtifactFile> {
  const fullPath = path.join(ARTIFACTS_ROOT, artifact.slug, file.path);
  const content = await readFile(fullPath, "utf-8");
  const lines = await highlightSource(content, file.language);
  return { ...file, content, lines };
}

/**
 * Reads every file registered against an artifact — this is what the
 * source viewer (§20) and the future ZIP export (§22) both build on.
 * The artifact system stays the single source of truth: nothing here
 * or in the viewer hardcodes a file list or its contents.
 */
export async function loadArtifactSource(
  artifact: ArtifactMetadata
): Promise<LoadedArtifactFile[]> {
  return Promise.all(
    artifact.files.map((file) => loadArtifactFile(artifact, file))
  );
}
