import { ArtifactCard } from "./ArtifactCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ArtifactDefinition } from "@/types/artifact";

export function ArtifactGrid({ artifacts }: { artifacts: ArtifactDefinition[] }) {
  if (artifacts.length === 0) {
    return (
      <EmptyState
        bordered
        title="No artifacts found"
        description="Try a different search term or category."
      />
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