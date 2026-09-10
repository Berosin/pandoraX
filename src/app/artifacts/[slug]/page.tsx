import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/ui/CopyButton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { PreviewFrame } from "@/components/preview/PreviewFrame";
import { SourcePanel } from "@/components/artifact/SourcePanel";
import { AssetsPanel } from "@/components/artifact/AssetsPanel";
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
    <Section className="pt-12">
      <Container>
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="text-h1 text-foreground">{artifact.name}</h1>
            <p className="mt-2 max-w-lg text-body text-muted">
              {artifact.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone="accent">{artifact.category}</Badge>
              <Badge tone="outline">{artifact.difficulty}</Badge>
              {artifact.technologies.map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-muted">
            <dt>License</dt>
            <dd className="text-foreground-dim">{artifact.license}</dd>
            <dt>Author</dt>
            <dd className="text-foreground-dim">{artifact.author}</dd>
            <dt>Version</dt>
            <dd className="text-foreground-dim">{artifact.version}</dd>
            <dt>Configurable</dt>
            <dd className="text-foreground-dim">
              {artifact.configurable ? "Yes" : "No"}
            </dd>
          </dl>
        </div>

        <div className="mt-10 flex min-h-[22rem] items-center justify-center rounded-lg border border-border bg-surface">
          <PreviewFrame artifact={artifact} />
        </div>

        <div className="mt-12">
          <Tabs defaultValue="source">
            <TabsList>
              {installCommand && (
                <TabsTrigger value="install">Installation</TabsTrigger>
              )}
              <TabsTrigger value="source">Source</TabsTrigger>
              {artifact.assets && artifact.assets.length > 0 && (
                <TabsTrigger value="assets">Assets</TabsTrigger>
              )}
            </TabsList>

            {installCommand && (
              <TabsContent value="install">
                <div className="flex items-center justify-between">
                  <p className="text-caption text-muted">
                    Run this in your project.
                  </p>
                  <CopyButton value={installCommand} />
                </div>
                <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-surface p-4 text-xs text-foreground-dim">
                  <code>{installCommand}</code>
                </pre>
              </TabsContent>
            )}

            <TabsContent value="source">
              <p className="text-caption text-muted">
                {artifact.files.length} file
                {artifact.files.length === 1 ? "" : "s"} · entry at{" "}
                <code className="font-mono text-foreground-dim">
                  {artifact.entry}
                </code>
              </p>
              <div className="mt-4">
                <SourcePanel files={source} />
              </div>
            </TabsContent>

            {artifact.assets && artifact.assets.length > 0 && (
              <TabsContent value="assets">
                <p className="text-caption text-muted">
                  {artifact.assets.length} asset
                  {artifact.assets.length === 1 ? "" : "s"} — served from this
                  artifact&apos;s own bundle, not the shared /public folder.
                </p>
                <div className="mt-4">
                  <AssetsPanel artifact={artifact} assets={artifact.assets} />
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </Container>
    </Section>
  );
}