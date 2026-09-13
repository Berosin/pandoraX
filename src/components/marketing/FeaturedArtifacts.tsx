import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ArtifactCard } from "@/components/artifact/ArtifactCard";
import { getFeaturedArtifacts } from "@/lib/registry";

export function FeaturedArtifacts() {
  const featured = getFeaturedArtifacts();
  if (featured.length === 0) return null;

  return (
    <Section divider>
      <Container>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-label text-accent">Featured</p>
            <h2 className="text-h2 mt-2 text-foreground">
              Artifacts worth a look
            </h2>
          </div>
          <Link
            href="/artifacts"
            className="shrink-0 text-sm text-accent hover:underline"
          >
            View all
          </Link>
        </div>

        <p className="mt-3 max-w-lg text-body text-muted">
          Every card is a live component — hover it, not a screenshot of it.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((artifact) => (
            <ArtifactCard key={artifact.id} artifact={artifact} />
          ))}
        </div>
      </Container>
    </Section>
  );
}