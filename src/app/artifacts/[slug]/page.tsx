import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/ui/CopyButton";
import { PreviewFrame } from "@/components/preview/PreviewFrame";
import { SourcePanel } from "@/components/artifact/SourcePanel";
import { getAllArtifacts, getArtifactBySlug } from "@/lib/registry";
import { loadArtifactSource } from "@/lib/artifact-loader";

interface ArtifactPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllArtifacts().map((artifact) => ({ slug: artifact.slug }));
}

export async function generateMetadata({
  params,
}: ArtifactPageProps): Promise<Metadata> {
  const { slug } = await params;
  const artifact = getArtifactBySlug(slug);
  if (!artifact) return {};

  return {
    title: artifact.name,
    description: artifact.description,
    alternates: { canonical: `/artifacts/${artifact.slug}` },
    openGraph: { title: artifact.name, description: artifact.description },
  };
}

export default async function ArtifactPage({ params }: ArtifactPageProps) {
  const { slug } = await params;
  const artifact = getArtifactBySlug(slug);
  if (!artifact) notFound();

  const source = await loadArtifactSource(artifact);
  const installCommand = artifact.dependencies.length
    ? `npm install ${artifact.dependencies.join(" ")}`
    : null;

  return (
    <Container className="py-16">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-cream">
            {artifact.name}
          </h1>
          <p className="mt-2 max-w-lg text-sm text-muted">
            {artifact.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone="bronze">{artifact.category}</Badge>
            <Badge tone="outline">{artifact.difficulty}</Badge>
            {artifact.technologies.map((tech) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-muted">
          <dt>License</dt>
          <dd className="text-cream-dim">{artifact.license}</dd>
          <dt>Author</dt>
          <dd className="text-cream-dim">{artifact.author}</dd>
          <dt>Version</dt>
          <dd className="text-cream-dim">{artifact.version}</dd>
          <dt>Configurable</dt>
          <dd className="text-cream-dim">
            {artifact.configurable ? "Yes" : "No"}
          </dd>
        </dl>
      </div>

      <div className="mt-10 flex min-h-[22rem] items-center justify-center rounded-2xl border border-line bg-surface">
        <PreviewFrame artifact={artifact} />
      </div>

      {installCommand && (
        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-cream">Installation</h2>
            <CopyButton value={installCommand} />
          </div>
          <pre className="mt-3 overflow-x-auto rounded-xl border border-line bg-surface p-4 text-xs text-cream-dim">
            <code>{installCommand}</code>
          </pre>
        </section>
      )}

      <section className="mt-12">
        <h2 className="text-lg font-medium text-cream">Source</h2>
        <p className="mt-1 text-sm text-muted">
          {artifact.files.length} file
          {artifact.files.length === 1 ? "" : "s"} · entry at{" "}
          <code className="font-mono text-cream-dim">{artifact.entry}</code>
        </p>
        <div className="mt-4">
          <SourcePanel files={source} />
        </div>
      </section>
    </Container>
  );
}
