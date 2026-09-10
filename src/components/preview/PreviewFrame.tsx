"use client";

import { Suspense } from "react";
import { ArtifactErrorBoundary } from "./ArtifactErrorBoundary";
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
 * break the gallery or detail page around it.
 *
 * "isolated" artifacts (heavy Three.js/WebGL/GSAP work) get an
 * additional scoping wrapper with its own stacking/containment
 * context. True process-level isolation (an iframe or worker,
 * with its own WebGL context lifecycle) is reserved for Phase 4 —
 * this establishes the seam that work will plug into without the
 * detail page or gallery needing to change.
 */
export function PreviewFrame({ artifact, values, className }: PreviewFrameProps) {
  const Component = artifact.component;

  const preview = (
    <ArtifactErrorBoundary>
      <Suspense fallback={<PreviewLoading />}>
        <Component {...values} />
      </Suspense>
    </ArtifactErrorBoundary>
  );

  return (
    <div
      className={className}
      data-render-mode={artifact.renderMode}
      style={artifact.renderMode === "isolated" ? { isolation: "isolate", contain: "layout paint" } : undefined}
    >
      {preview}
    </div>
  );
}

function PreviewLoading() {
  return (
    <div className="flex h-full items-center justify-center text-xs text-muted">
      Initializing artifact…
    </div>
  );
}
