import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { OpenTheBoxButton } from "@/components/artifact/OpenTheBoxButton";
import { HeroVisual } from "@/components/marketing/HeroVisual";

export function Hero() {
  return (
    <Section
      divider
      className="relative overflow-hidden pt-24 sm:pt-28"
    >
      {/* Faint, static technical backdrop — no motion, cheap to render */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--color-foreground) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 60% 60% at 50% 30%, black, transparent)",
        }}
      />

      <Container className="relative flex flex-col items-center text-center">
        <HeroVisual />

        <p className="text-label mt-8 text-accent">PandoraX</p>
        <h1 className="text-display mt-3 text-foreground">
          Open the extraordinary.
        </h1>
        <p className="text-body mt-5 max-w-xl text-balance text-foreground-dim">
          A collection of interactive components, motion experiments, WebGL
          scenes and creative digital artifacts for the modern web.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <LinkButton href="/artifacts">Explore Artifacts</LinkButton>
          <OpenTheBoxButton />
        </div>
      </Container>
    </Section>
  );
}