import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { getAllArtifacts } from "@/lib/registry";

export function FinalCta() {
  const count = getAllArtifacts().length;

  return (
    <Section>
      <Container className="flex flex-col items-center text-center">
        <h2 className="text-h1 text-foreground">
          Build something extraordinary.
        </h2>
        <p className="mt-3 max-w-md text-body text-muted">
          {count} artifact{count === 1 ? "" : "s"} {count === 1 ? "is" : "are"}{" "}
          live. More are on the way — open the collection and see
          what&apos;s inside.
        </p>
        <LinkButton href="/artifacts" className="mt-8">
          Explore Artifacts
        </LinkButton>
      </Container>
    </Section>
  );
}