import { Container } from "@/components/ui/Container";
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
      <section className="border-b border-line py-28">
        <Container className="flex flex-col items-center text-center">
          <Mark size={64} />
          <h1 className="mt-8 text-5xl font-semibold tracking-tight text-cream sm:text-6xl">
            Open the extraordinary.
          </h1>
          <p className="mt-5 max-w-xl text-balance text-base text-cream-dim">
            Interactive components, motion experiments, WebGL scenes and
            creative digital artifacts for the modern web. Explore it.
            Customize it. Take the source.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <LinkButton href="/artifacts">Explore Artifacts</LinkButton>
            <OpenTheBoxButton />
          </div>
        </Container>
      </section>

      {featured.length > 0 && (
        <section className="border-b border-line py-20">
          <Container>
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-medium text-cream">
                Featured artifacts
              </h2>
              <Link
                href="/artifacts"
                className="text-sm text-bronze hover:underline"
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
        </section>
      )}

      <section className="border-b border-line py-20">
        <Container>
          <h2 className="text-2xl font-medium text-cream">Categories</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {ARTIFACT_CATEGORIES.map((category) => (
              <Link
                key={category}
                href="/artifacts"
                className="rounded-full border border-line-strong px-4 py-2 text-sm text-cream-dim transition-colors hover:border-bronze hover:text-bronze"
              >
                {category}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-semibold text-cream">
            Build something extraordinary.
          </h2>
          <LinkButton href="/artifacts" className="mt-7">
            Explore PandoraX
          </LinkButton>
        </Container>
      </section>
    </>
  );
}
