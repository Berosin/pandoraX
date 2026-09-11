import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { MetadataPanel } from "@/components/artifact/MetadataPanel";
import { ArtifactWorkspace } from "@/components/artifact/ArtifactWorkspace";
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

        {/*
          lg+: workspace and metadata sit side by side.
          Below lg: normal document order — workspace first (what people
          came for), metadata panel after, full width. The sidebar
          content is never squeezed into a narrow column on mobile.
        */}
        <div className="mt-10 lg:grid lg:grid-cols-[1fr_18rem] lg:items-start lg:gap-8">
          <ArtifactWorkspace
            artifact={artifact}
            source={source}
            installCommand={installCommand}
          />

          <aside className="mt-10 lg:sticky lg:top-24 lg:mt-0">
            <MetadataPanel artifact={artifact} />
          </aside>
        </div>
      </Container>
    </Section>
  );
}