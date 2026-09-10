# PandoraX

Open the extraordinary.

PandoraX is a premium, developer-focused library of interactive web
artifacts — React animations, Motion, GSAP, Three.js, React Three Fiber,
WebGL, GLSL shaders and other experimental visual components. The core
experience is:

**Discover → Preview → Customize → Inspect Source → Download**

## Status: Phase 0 — Foundation

This build establishes the project's architecture only: routing, design
system, UI primitives, and the artifact-driven registry that every future
surface (gallery, detail page, code viewer, downloader) will consume.
Customization UI, a full syntax-highlighted code viewer and ZIP export are
intentionally not built yet — see [`lib/download.ts`](./src/lib/download.ts)
and the config schema in [`types/artifact.ts`](./src/types/artifact.ts) for
where that work plugs in.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

PandoraX is **artifact-driven, not page-driven**. Adding a new artifact
means creating a folder under `src/artifacts/<slug>/`, exporting an
`ArtifactDefinition` from its `artifact.config.ts`, and registering it in
`src/artifacts/index.ts`. The gallery, search, detail page, code viewer and
download system all read from that registry — none of them need to change.

```text
src/
├── app/                       # Routing only — pages stay thin
│   ├── page.tsx                 /
│   ├── artifacts/
│   │   ├── page.tsx              /artifacts
│   │   └── [slug]/page.tsx       /artifacts/[slug]
│   ├── collections/page.tsx     /collections   (route established, not built)
│   ├── playground/page.tsx      /playground    (route established, not built)
│   ├── docs/page.tsx            /docs          (route established, not built)
│   └── about/page.tsx           /about
│
├── components/
│   ├── ui/                    # Reusable primitives: Button, Card, Badge…
│   ├── layout/                # Header, Footer, ComingSoon
│   ├── artifact/              # ArtifactCard, ArtifactExplorer, OpenTheBoxButton…
│   └── preview/                # PreviewFrame + ArtifactErrorBoundary — the
│                                 direct/isolated rendering seam
│
├── artifacts/                 # Artifact SOURCE, kept separate from platform code
│   ├── index.ts                 registers every artifact
│   ├── magnetic-button/
│   │   ├── artifact.config.ts   metadata + component reference
│   │   ├── index.tsx
│   │   └── useMagnetic.ts       (multi-file example)
│   └── text-reveal/
│
├── lib/
│   ├── registry.ts             query the artifact catalog
│   ├── search.ts                filter/search over the catalog
│   ├── configuration.ts        resolve config schema → values
│   ├── artifact-loader.ts      read real source files off disk (server-only)
│   └── download.ts             reserved contract for future ZIP export
│
└── types/
    └── artifact.ts             the contract: ArtifactDefinition, config schema, etc.
```

### Render isolation

Every artifact declares a `renderMode`: `"direct"` for lightweight
DOM/CSS/Motion artifacts, `"isolated"` for anything WebGL/Three.js/GSAP-heavy.
`PreviewFrame` wraps every artifact — regardless of mode — in an error
boundary and a loading boundary, so a broken preview can never take down the
gallery around it. True process-level isolation (iframe/worker, dedicated
WebGL context lifecycle) is reserved for the Three.js/WebGL phase; the seam
is in place now so that work won't require touching the gallery or detail
page.

## Stack

Next.js (App Router) · TypeScript · React · Tailwind CSS v4. Motion, GSAP,
Three.js, React Three Fiber and React Three Drei are installed and ready for
the artifacts that need them.
