import { getArtifactAssetUrl } from "@/lib/artifact-assets";
import type { ArtifactAsset, ArtifactDefinition } from "@/types/artifact";

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"];

function isImage(path: string) {
  return IMAGE_EXTENSIONS.some((ext) => path.toLowerCase().endsWith(ext));
}

export function AssetsPanel({
  artifact,
  assets,
}: {
  artifact: ArtifactDefinition;
  assets: ArtifactAsset[];
}) {
  return (
    <div className="divide-y divide-border overflow-hidden rounded-lg border border-border">
      {assets.map((asset) => {
        const url = getArtifactAssetUrl(artifact, asset.path);
        return (
          <div key={asset.path} className="flex items-center gap-4 p-4">
            {isImage(asset.path) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={url}
                alt={asset.description ?? asset.path}
                className="h-12 w-12 shrink-0 rounded-sm border border-border object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-border text-xs text-muted">
                file
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-mono text-xs text-foreground-dim">
                {asset.path}
              </p>
              {asset.description && (
                <p className="mt-1 text-xs text-muted">{asset.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}