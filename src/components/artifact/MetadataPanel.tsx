import { Badge } from "@/components/ui/Badge";
import type { ArtifactDefinition, PerformanceImpact } from "@/types/artifact";
import { cn } from "@/lib/cn";

const impactTone: Record<PerformanceImpact, string> = {
  Low: "text-accent",
  Moderate: "text-foreground-dim",
  High: "text-foreground-dim",
};

function MetaRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-4">
      <p className="text-label text-muted">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function MetadataPanel({ artifact }: { artifact: ArtifactDefinition }) {
  return (
    <div className="divide-y divide-border rounded-lg border border-border px-5">
      <MetaRow label="Technologies">
        <div className="flex flex-wrap gap-1.5">
          {artifact.technologies.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>
      </MetaRow>

      <MetaRow label="Dependencies">
        {artifact.dependencies.length > 0 ? (
          <ul className="space-y-1">
            {artifact.dependencies.map((dep) => (
              <li key={dep} className="font-mono text-xs text-foreground-dim">
                {dep}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-muted">None</p>
        )}
      </MetaRow>

      <MetaRow label="Performance">
        <p className={cn("text-sm font-medium", impactTone[artifact.performance.impact])}>
          {artifact.performance.impact} impact
        </p>
        {artifact.performance.notes && (
          <p className="mt-1 text-xs text-muted">{artifact.performance.notes}</p>
        )}
      </MetaRow>

      <MetaRow label="Browser requirements">
        <ul className="space-y-1">
          {artifact.browserRequirements.map((req) => (
            <li key={req} className="text-xs text-foreground-dim">
              {req}
            </li>
          ))}
        </ul>
      </MetaRow>

      <MetaRow label="License">
        <p className="text-sm text-foreground-dim">{artifact.license}</p>
      </MetaRow>

      <MetaRow label="Version">
        <p className="text-sm text-foreground-dim">{artifact.version}</p>
      </MetaRow>

      <MetaRow label="Author">
        <p className="text-sm text-foreground-dim">{artifact.author}</p>
      </MetaRow>
    </div>
  );
}