import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Code2, PackageOpen, Layers, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Reason {
  icon: LucideIcon;
  title: string;
  description: string;
}

const reasons: Reason[] = [
  {
    icon: Code2,
    title: "Real, running code",
    description:
      "Every artifact on the site is a live component, not a screenshot or a video loop. What you preview is what you get.",
  },
  {
    icon: PackageOpen,
    title: "Explore, then inspect",
    description:
      "Open an artifact, see it run, and read its actual source — down to the individual files that make it up.",
  },
  {
    icon: Layers,
    title: "Built on modern tools",
    description:
      "Motion, GSAP, Three.js, React Three Fiber and raw WebGL/GLSL — the stack real products ship with, not toy demos.",
  },
  {
    icon: ShieldCheck,
    title: "Yours to learn from",
    description:
      "MIT-licensed by default — free to study, adapt and bring into your own work.",
  },
];

export function WhyPandoraX() {
  return (
    <Section divider>
      <Container>
        <p className="text-label text-accent">Why PandoraX</p>
        <h2 className="text-h2 mt-2 max-w-lg text-foreground">
          Built for developers who want more than a snippet.
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map(({ icon: Icon, title, description }) => (
            <div key={title}>
              <Icon size={20} className="text-accent" />
              <h3 className="mt-4 text-sm font-medium text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-caption text-muted">{description}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}