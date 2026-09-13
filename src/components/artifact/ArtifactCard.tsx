import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { PreviewFrame } from "@/components/preview/PreviewFrame";
import type { ArtifactDefinition } from "@/types/artifact";

export function ArtifactCard({ artifact }: { artifact: ArtifactDefinition }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-colors hover:border-border-strong">
      <div className="flex h-48 items-center justify-center border-b border-border bg-background/40 p-6">
        <PreviewFrame artifact={artifact} />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="text-h3 text-foreground">{artifact.name}</h3>
          <p className="mt-1.5 line-clamp-2 text-caption text-muted">
            {artifact.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Badge tone="accent">{artifact.category}</Badge>
          <Badge tone="outline">{artifact.difficulty}</Badge>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {artifact.technologies.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>

        <LinkButton
          href={`/artifacts/${artifact.slug}`}
          variant="secondary"
          size="sm"
          className="mt-auto"
        >
          Open Artifact
        </LinkButton>
      </div>
    </Card>
  );
}