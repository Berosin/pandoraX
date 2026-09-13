# Shader Backdrop

A full-bleed, domain-warped GLSL gradient rendered on a raw WebGL2
context — no Three.js, no react-three-fiber. Every other Phase 11
artifact goes through React Three Fiber; this one manages `getContext`,
the render loop, resizing, and teardown by hand, on purpose, to prove
the platform doesn't require any particular WebGL wrapper.

## What this validates

- **Raw WebGL2**, compiled and linked from scratch in `webgl-utils.ts` —
  a fullscreen two-triangle quad and a fragment shader doing all the work.
- **An explicit "WebGL unavailable" fallback.** `canvas.getContext()`
  returning `null` doesn't throw, so — unlike the React Three Fiber
  artifacts, which the shared `ArtifactErrorBoundary` already catches —
  this component checks for it directly and renders an honest message
  instead of a blank canvas.
- **Manual resource cleanup.** On unmount: `cancelAnimationFrame`,
  `ResizeObserver.disconnect()`, `gl.deleteProgram`/`deleteBuffer`, and
  — because WebGL contexts are a scarce, browser-limited resource, and
  this artifact gets mounted and unmounted every time it scrolls in and
  out of view — an explicit call to the `WEBGL_lose_context` extension
  to free the context immediately rather than waiting on GC.
- **Container-based resize**, not `window` resize — a `ResizeObserver`
  on the canvas itself, so it responds correctly however it's sized.
- **Cheap reconfiguration.** Config changes update a ref read inside the
  render loop; no shader is ever recompiled after the first mount.

## Configuration

| Key      | Type   | Default   | Group      |
| -------- | ------ | --------- | ---------- |
| `colorA` | color  | `#1b1240` | Appearance |
| `colorB` | color  | `#6c3fd1` | Appearance |
| `scale`  | number | `1.4`     | Appearance |
| `warp`   | number | `0.6`     | Appearance |
| `speed`  | number | `0.25`    | Animation  |

Four presets ship alongside the schema — Default, Calm ink, Solar, and
Deep sea — selectable from the Customize panel.
