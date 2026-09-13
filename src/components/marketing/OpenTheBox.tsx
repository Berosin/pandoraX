import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { OpenTheBoxButton } from "@/components/artifact/OpenTheBoxButton";
import { Dices } from "lucide-react";

export function OpenTheBox() {
  return (
    <Section divider>
      <Container>
        <div className="flex flex-col items-center gap-5 rounded-lg border border-border bg-surface px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-md border border-border-strong text-accent">
            <Dices size={20} />
          </div>
          <div>
            <h2 className="text-h2 text-foreground">Open the Box</h2>
            <p className="mt-2 max-w-md text-body text-muted">
              Skip the browsing. Jump straight into a random artifact from
              the collection.
            </p>
          </div>
          <OpenTheBoxButton />
        </div>
      </Container>
    </Section>
  );
}