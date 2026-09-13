# Preview Architecture

How PandoraX renders artifacts as live, interactive experiences without
letting any single artifact take down the rest of the app.

## The layers

1. **Visibility-gated mounting** (`lib/use-in-viewport.ts`)
   `PreviewFrame` only renders an artifact's `component` while it is
   both scrolled into view (`IntersectionObserver`, 200px root margin so
   there's no visible pop-in) and the browser tab is active
   (`visibilitychange`). Scroll an artifact off-screen, or switch tabs,
   and it fully **unmounts** — not just `display: none`. This is the
   primary GPU/CPU savings mechanism: a gallery of a dozen WebGL and
   Canvas2D artifacts only ever has the visible ones actually running.

   This is also what makes cleanup correctness non-optional: every
   artifact mounts and unmounts repeatedly as the person scrolls, so a
   leaked `requestAnimationFrame` loop or event listener shows up
   immediately (rising CPU, stacking listeners) rather than staying
   latent until a full page navigation.

2. **Error boundary** (`ArtifactErrorBoundary`)
   Wraps every artifact, direct or isolated. If an artifact throws
   during render or in a lifecycle method, only that artifact's preview
   is replaced with:

   > Artifact unavailable — Retry

   Nothing else on the page is affected. Clicking Retry clears the
   error state, which causes React to mount a fresh instance of the
   artifact (the crashed subtree was already unmounted when the error
   was caught).

   This does **not** catch errors thrown from outside React's call
   stack — a `requestAnimationFrame` callback, a native event listener,
   a GSAP tween's `onComplete`. Those are the artifact author's own
   responsibility to keep from throwing (see the checklist below); if
   they do throw, they fail silently to the console rather than
   crashing anything, since nothing else on the page depends on that
   call stack.

3. **CSS containment for `renderMode: "isolated"`**
   Artifacts that declare `"isolated"` (WebGL, GSAP with global
   listeners, anything with real GPU or document-level side effects)
   get `isolation: isolate; contain: layout paint;` on their wrapper.
   This keeps stacking contexts and layout/paint invalidation scoped to
   the artifact, so it can't affect sibling cards' layout or paint
   order. It is a CSS-level boundary, not a process-level sandbox — an
   iframe/worker-based sandbox is the next layer up if an artifact ever
   needs true isolation from the host page's JS realm. Nothing
   registered today needs that.

## The cleanup checklist (every artifact author follows this)

An artifact's `component` must return everything it touched to its
pre-mount state when it unmounts — because it *will* unmount and remount
repeatedly (see above), not just once on page close.

- **Event listeners** — every `addEventListener` (on `window`, `document`,
  or a DOM node) needs a matching `removeEventListener` in the effect's
  cleanup function.
- **Animation loops** — every `requestAnimationFrame` needs its id
  captured and passed to `cancelAnimationFrame` on cleanup. Check
  `prefers-reduced-motion` before starting the loop in the first place.
- **GSAP** — scope tweens with `gsap.context(fn, scopeRef)` and call
  `ctx.revert()` in the cleanup function. This kills in-flight tweens,
  reverts any inline styles GSAP set, and removes anything registered
  inside the context — see `artifacts/drag-snap-card`.
- **Three.js / React Three Fiber** — prefer declaring geometries and
  materials as JSX (`<icosahedronGeometry />`, `<shaderMaterial />`);
  R3F disposes anything it created automatically when `<Canvas>`
  unmounts, including the `WebGLRenderer` itself. If you ever create a
  Three.js object imperatively (outside JSX), you're responsible for
  calling `.dispose()` on it yourself. See `artifacts/shader-sphere`.
- **WebGL context loss** — a GPU-heavy artifact should listen for
  `webglcontextlost` on the canvas and call `event.preventDefault()` so
  the browser can attempt to restore the context, instead of leaving a
  frozen frame. See `artifacts/shader-sphere/index.tsx`.
- **Textures** — anything loaded with `THREE.TextureLoader` needs
  `.dispose()` when no longer referenced (R3F's `useTexture` from
  `@react-three/drei` handles this automatically; raw `TextureLoader`
  usage does not).

None of this is enforced by the type system — it's a convention. The
visibility-gated mounting above is what turns a violation into an
immediately visible bug (growing memory/listeners as you scroll) instead
of a silent one.