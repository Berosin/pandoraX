import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";

export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Container className="flex flex-col items-center py-32 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-cream">
        {title}
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted">{description}</p>
      <LinkButton href="/artifacts" variant="secondary" className="mt-8">
        Explore Artifacts
      </LinkButton>
    </Container>
  );
}
