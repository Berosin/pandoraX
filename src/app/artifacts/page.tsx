import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ArtifactExplorer } from "@/components/artifact/ArtifactExplorer";
import { getAllArtifacts, getUsedCategories } from "@/lib/registry";

export const metadata: Metadata = {
  title: "Explore Artifacts",
  description:
    "Browse PandoraX's library of interactive components, motion experiments and WebGL scenes.",
};

export default function ArtifactsPage() {
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
          <ArtifactExplorer artifacts={artifacts} categories={categories} />
        </div>
      </Container>
    </Section>
  );
}