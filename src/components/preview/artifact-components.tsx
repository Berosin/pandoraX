"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { ArtifactConfigValues } from "@/types/artifact";

type ArtifactComponent = ComponentType<Partial<ArtifactConfigValues>>;

/**
 * Every artifact's live component, wrapped in `next/dynamic` — each
 * entry is its own code-split chunk, fetched only the first time
 * PreviewFrame actually renders that specific artifact (gated by
 * viewport visibility, see lib/use-in-viewport.ts). No entry here
 * loads anything just by this map existing; `dynamic()`'s import()
 * call doesn't run until the returned component is rendered.
 *
 * This lives in its own "use client" module, separate from the
 * artifact registry (@/lib/registry, @/artifacts), specifically so
 * that reading an artifact's plain metadata — on the server, or from
 * a Client Component like the header's "Open the Box" button — never
 * has this file (or any artifact's actual dependencies) anywhere in
 * its import graph. `ssr: false` because every one of these is a
 * browser-only DOM/Canvas/WebGL component with nothing meaningful to
 * render on the server, and PreviewFrame never mounts one before its
 * own client-side viewport check has passed anyway.
 *
 * Keyed by slug so PreviewFrame only needs the plain string it
 * already has — see components/preview/PreviewFrame.tsx.
 */
export const ARTIFACT_COMPONENTS: Record<string, ArtifactComponent> = {
  "magnetic-button": dynamic(() => import("@/artifacts/magnetic-button/index"), {
    ssr: false,
  }),
  "text-reveal": dynamic(() => import("@/artifacts/text-reveal/index"), {
    ssr: false,
  }),
  "aurora-globe": dynamic(() => import("@/artifacts/aurora-globe/index"), {
    ssr: false,
  }),
  "grain-overlay": dynamic(() => import("@/artifacts/grain-overlay/index"), {
    ssr: false,
  }),
  "drag-snap-card": dynamic(() => import("@/artifacts/drag-snap-card/index"), {
    ssr: false,
  }),
  "shader-sphere": dynamic(() => import("@/artifacts/shader-sphere/index"), {
    ssr: false,
  }),
  "crystal-gem": dynamic(() => import("@/artifacts/crystal-gem/index"), {
    ssr: false,
  }),
  "particle-field": dynamic(() => import("@/artifacts/particle-field/index"), {
    ssr: false,
  }),
  "shader-backdrop": dynamic(() => import("@/artifacts/shader-backdrop/index"), {
    ssr: false,
  }),
  "ripple-scene": dynamic(() => import("@/artifacts/ripple-scene/index"), {
    ssr: false,
  }),
  "threejs-environment": dynamic(
    () => import("@/artifacts/threejs-environment/index"),
    { ssr: false }
  ),
};
