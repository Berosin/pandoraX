import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PreviewFrame } from "@/components/preview/PreviewFrame";
import type { ArtifactDefinition } from "@/types/artifact";

export function ArtifactCard({ artifact }: { artifact: ArtifactDefinition }) {
  return (
    <Card className="group flex flex-col overflow-hidden transition-colors hover:border-border-strong">
      <div className="flex h-48 items-center justify-center border-b border-border bg-background/40 p-6">
        <PreviewFrame artifact={artifact} />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="text-h3 text-foreground">{artifact.name}</h3>
          <p className="mt-1 text-caption text-muted">
            {artifact.category} • {artifact.difficulty}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {artifact.technologies.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="line-clamp-1 text-xs text-muted">{artifact.description}</p>
          <Link
            href={`/artifacts/${artifact.slug}`}
            className="shrink-0 pl-3 text-sm font-medium text-accent hover:underline"
          >
            Open
          </Link>
        </div>
      </div>
    </Card>
  );
}