import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";

export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Container>
      <EmptyState
        title={title}
        description={description}
        action={
          <LinkButton href="/artifacts" variant="secondary">
            Explore Artifacts
          </LinkButton>
        }
        className="py-32"
      />
    </Container>
  );
}