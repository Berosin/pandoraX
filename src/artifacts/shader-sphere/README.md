# Shader Sphere

A faceted icosahedron with a custom GLSL `ShaderMaterial` — a fresnel rim
light and a drifting color wave computed entirely on the GPU. Move your
pointer over it to tilt it; click for a small pulse.

This is the artifact `aurora-globe`'s README pointed to: the first one
in PandoraX with a real, live WebGL context, built once the preview
engine (visibility-gated mounting + cleanup discipline) existed to
support it safely.

## What this validates

- **Real GLSL**, not a reference copy — `shaders.ts` is compiled and
  running on the GPU via `<shaderMaterial>`.
- **React Three Fiber disposal.** The geometry and material are declared
  as JSX (`<icosahedronGeometry />`, `<shaderMaterial />`), so R3F
  disposes them automatically — along with the `WebGLRenderer` itself —
  the moment `<Canvas>` unmounts. Nothing here calls `.dispose()`
  manually because nothing here needs to.
- **Visibility-gated GPU usage.** `PreviewFrame` unmounts this artifact's
  `<Canvas>` entirely when it scrolls off-screen or the tab is
  backgrounded — the WebGL context is torn down, not just paused.
- **WebGL context-loss handling.** `event.preventDefault()` on
  `webglcontextlost` gives the browser a chance to restore the context
  instead of leaving a permanently frozen frame.
- **Pointer interaction on a canvas.** `onPointerMove` / `onClick` on
  the mesh use React Three Fiber's built-in raycasting — the same
  pointer events work whether the artifact is direct- or isolated-mode.

## Configuration

| Key      | Type  | Default   |
| -------- | ----- | --------- |
| `colorA` | color | `#3aa88c` |
| `colorB` | color | `#7859c8` |