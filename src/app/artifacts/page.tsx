import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ArtifactExplorer } from "@/components/artifact/ArtifactExplorer";
import { getAllArtifacts, getUsedCategories } from "@/lib/registry";
import { ARTIFACT_CATEGORIES, type ArtifactCategory } from "@/types/artifact";

export const metadata: Metadata = {
  title: "Explore Artifacts",
  description:
    "Browse PandoraX's library of interactive components, motion experiments and WebGL scenes.",
};

function parseCategory(value: string | undefined): ArtifactCategory | undefined {
  return ARTIFACT_CATEGORIES.find((category) => category === value);
}

interface ArtifactsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ArtifactsPage({ searchParams }: ArtifactsPageProps) {
  const { category } = await searchParams;
  const artifacts = getAllArtifacts();
  const categories = getUsedCategories();

  return (
    <Section className="pt-12">
      <Container>
        <h1 className="text-h1 text-foreground">Explore Artifacts</h1>
        <p className="mt-2 max-w-lg text-body text-muted">
          Every card below is a real, running artifact — not a screenshot.
        </p>

        <div className="mt-10">
          <ArtifactExplorer
            artifacts={artifacts}
            categories={categories}
            initialCategory={parseCategory(category)}
          />
        </div>
      </Container>
    </Section>
  );
}