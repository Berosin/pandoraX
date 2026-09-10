import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { OpenTheBoxButton } from "@/components/artifact/OpenTheBoxButton";
import { ArtifactCard } from "@/components/artifact/ArtifactCard";
import { Mark } from "@/components/ui/Logo";
import { ARTIFACT_CATEGORIES } from "@/types/artifact";
import { getFeaturedArtifacts } from "@/lib/registry";
import Link from "next/link";

export default function HomePage() {
  const featured = getFeaturedArtifacts();

  return (
    <>
      <Section divider className="pt-24 sm:pt-28">
        <Container className="flex flex-col items-center text-center">
          <Mark size={64} />
          <h1 className="text-display mt-8 text-foreground">
            Open the extraordinary.
          </h1>
          <p className="text-body mt-5 max-w-xl text-balance text-foreground-dim">
            Interactive components, motion experiments, WebGL scenes and
            creative digital artifacts for the modern web. Explore it.
            Customize it. Take the source.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <LinkButton href="/artifacts">Explore Artifacts</LinkButton>
            <OpenTheBoxButton />
          </div>
        </Container>
      </Section>

      {featured.length > 0 && (
        <Section divider>
          <Container>
            <div className="flex items-end justify-between">
              <h2 className="text-h2 text-foreground">Featured artifacts</h2>
              <Link
                href="/artifacts"
                className="text-sm text-accent hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((artifact) => (
                <ArtifactCard key={artifact.id} artifact={artifact} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section divider>
        <Container>
          <h2 className="text-h2 text-foreground">Categories</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {ARTIFACT_CATEGORIES.map((category) => (
              <Link
                key={category}
                href="/artifacts"
                className="rounded-md border border-border-strong px-4 py-2 text-sm text-foreground-dim transition-colors hover:border-accent hover:text-accent"
              >
                {category}
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="flex flex-col items-center text-center">
          <h2 className="text-h2 text-foreground">
            Build something extraordinary.
          </h2>
          <LinkButton href="/artifacts" className="mt-7">
            Explore PandoraX
          </LinkButton>
        </Container>
      </Section>
    </>
  );
}