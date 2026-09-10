import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { techGroups } from "@/lib/tech-stack";

export function TechShowcase() {
  return (
    <Section divider>
      <Container>
        <p className="text-label text-accent">Stack</p>
        <h2 className="text-h2 mt-2 text-foreground">
          Built with tools that scale
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {techGroups.map((group) => (
            <div key={group.label}>
              <p className="text-label text-muted">{group.label}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-sm border border-border-strong px-3 py-1.5 font-mono text-xs text-foreground-dim"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}