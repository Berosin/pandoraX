import { SourceViewer } from "@/components/artifact/source-viewer/SourceViewer";
import type { LoadedArtifactFile } from "@/lib/artifact-loader";

/**
 * The artifact detail page's "Source" tab. A thin wrapper so the rest
 * of the platform (ArtifactWorkspace) doesn't need to know the viewer
 * moved into components/artifact/source-viewer/ for Phase 7 — it's a
 * multi-file tree + tokenized code view, not a flat dump of <pre> tags.
 */
export function SourcePanel({
  files,
  entry,
  slug,
}: {
  files: LoadedArtifactFile[];
  entry: string;
  slug: string;
}) {
  return <SourceViewer files={files} entry={entry} slug={slug} />;
}
