import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "About",
  description: "What PandoraX is and how it's built.",
};

export default function AboutPage() {
  return (
    <Container className="max-w-2xl py-20">
      <h1 className="text-3xl font-semibold tracking-tight text-cream">
        About PandoraX
      </h1>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-cream-dim">
        <p>
          PandoraX is a library of interactive web artifacts — animated
          components, motion effects, cursor and scroll interactions, and
          Three.js/WebGL scenes — built for developers who want more than a
          screenshot and a snippet.
        </p>
        <p>
          Every artifact renders as a real, running component. The plan is
          simple: explore an artifact, customize it, inspect its source,
          and take it with you.
        </p>
        <p>
          The platform is artifact-driven: each artifact is a self-contained
          bundle of metadata, configuration and source files. The gallery,
          detail pages, code viewer and download system all read from that
          same registry, so new artifacts can be added without rewriting
          the site around them.
        </p>
        <p>
          PandoraX is under active development. This build establishes the
          foundation — routing, the design system, the artifact registry and
          the preview architecture. Customization, a full code viewer and
          downloadable source are on the way.
        </p>
      </div>
    </Container>
  );
}
