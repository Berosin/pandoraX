import { ArtifactCard } from "./ArtifactCard";
import type { ArtifactDefinition } from "@/types/artifact";

export function ArtifactGrid({ artifacts }: { artifacts: ArtifactDefinition[] }) {
  if (artifacts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line-strong py-20 text-center">
        <p className="text-sm font-medium text-cream">No artifacts found</p>
        <p className="mt-1 text-sm text-muted">
          Try a different search term or category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {artifacts.map((artifact) => (
        <ArtifactCard key={artifact.id} artifact={artifact} />
      ))}
    </div>
  );
}
