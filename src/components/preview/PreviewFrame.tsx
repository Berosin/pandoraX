"use client";

import { Suspense } from "react";
import { ArtifactErrorBoundary } from "./ArtifactErrorBoundary";
import { ARTIFACT_COMPONENTS } from "./artifact-components";
import { Spinner } from "@/components/ui/Spinner";
import { useInViewport } from "@/lib/use-in-viewport";
import { cn } from "@/lib/cn";
import type { ArtifactDefinition, ArtifactConfigValues } from "@/types/artifact";

interface PreviewFrameProps {
  artifact: ArtifactDefinition;
  values?: Partial<ArtifactConfigValues>;
  className?: string;
}

/**
 * Mounts an artifact's live component for preview.
 *
 * Every artifact — regardless of render mode — is wrapped in an error
 * boundary and a loading boundary, so one broken preview can never
 * break the gallery or detail page around it. See
 * components/preview/PREVIEW_ARCHITECTURE.md for the full isolation
 * strategy this is one layer of.
 *
 * The live component only mounts while this frame is actually visible
 * (in viewport AND the tab is active) — see lib/use-in-viewport.ts.
 * Scrolling an artifact off-screen unmounts it entirely, which is what
 * drives every artifact's cleanup path (cancelAnimationFrame, removed
 * listeners, gsap context.revert(), the WebGL renderer/geometry/material
 * disposal React Three Fiber performs automatically on unmount). A
 * 200px rootMargin pre-mounts just before an artifact scrolls into
 * view, so there's no visible pop-in.
 *
 * The component itself is looked up by slug from ARTIFACT_COMPONENTS
 * (components/preview/artifact-components.tsx) rather than read off
 * `artifact` directly — that map is what actually code-splits each
 * artifact's dependencies (Three.js, GSAP, ...) into its own chunk,
 * fetched only once this frame both exists and is visible. `artifact`
 * itself carries no component reference; it's plain, lightweight data.
 *
 * "isolated" artifacts (heavy Three.js/WebGL/GSAP work) additionally
 * get a CSS containment/stacking boundary. True process-level isolation
 * (an iframe or worker) would be the next layer up if a future artifact
 * ever needs it — not required for anything registered today.
 */
export function PreviewFrame({ artifact, values, className }: PreviewFrameProps) {
  const Component = ARTIFACT_COMPONENTS[artifact.slug];
  const { ref, inViewport } = useInViewport<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn("flex h-full w-full items-center justify-center", className)}
      data-render-mode={artifact.renderMode}
      style={
        artifact.renderMode === "isolated"
          ? { isolation: "isolate", contain: "layout paint" }
          : undefined
      }
    >
      <ArtifactErrorBoundary>
        <Suspense fallback={<PreviewLoading />}>
          {inViewport && Component ? <Component {...values} /> : null}
        </Suspense>
      </ArtifactErrorBoundary>
    </div>
  );
}

function PreviewLoading() {
  return (
    <div className="flex h-full items-center justify-center text-muted">
      <Spinner size={18} />
    </div>
  );
}