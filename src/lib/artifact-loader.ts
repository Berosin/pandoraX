import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ArtifactDefinition, ArtifactFile } from "@/types/artifact";

const ARTIFACTS_ROOT = path.join(process.cwd(), "src", "artifacts");

export interface LoadedArtifactFile extends ArtifactFile {
  content: string;
}

/** Reads a single artifact source file off disk, relative to its folder. */
export async function loadArtifactFile(
  artifact: ArtifactDefinition,
  file: ArtifactFile
): Promise<LoadedArtifactFile> {
  const fullPath = path.join(ARTIFACTS_ROOT, artifact.slug, file.path);
  const content = await readFile(fullPath, "utf-8");
  return { ...file, content };
}

/**
 * Reads every file registered against an artifact. This is what the
 * future code viewer (§20) and ZIP export (§22) will both build on —
 * for now it's exercised by the artifact detail page's plain-text
 * source panel.
 */
export async function loadArtifactSource(
  artifact: ArtifactDefinition
): Promise<LoadedArtifactFile[]> {
  return Promise.all(
    artifact.files.map((file) => loadArtifactFile(artifact, file))
  );
}
