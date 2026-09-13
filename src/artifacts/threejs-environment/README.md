# Three.js Environment

A small floating crystal cluster — loaded from a real `.glb` file, not
built from inline geometry — set inside a starfield with fog, two
slowly orbiting point lights, an interactive camera, a textured ground
plane, and a bloom pass. The fullest scene in Phase 11's advanced
Three.js/WebGL set — the "Three.js environment" entry, and the one
that exercises the most of the stack at once: multiple lights, fog,
camera controls, a real glTF asset, a generated texture, and
post-processing.

## About `assets/crystals.glb`

This is a genuine, spec-compliant binary glTF file — five separate mesh
nodes (low-poly icosahedra/octahedra), each with its own PBR material,
sharing one binary buffer. It wasn't downloaded from anywhere: it was
generated once by a small script that built the geometry with plain
`three` (`IcosahedronGeometry`/`OctahedronGeometry`), then hand-packed
the glTF 2.0 JSON + binary chunks into a `.glb` container — no DOM APIs,
so it runs in plain Node. `CrystalModel.tsx` loads it the same way any
external model would be loaded: through Drei's `useGLTF`, over HTTP,
via the artifact assets route.

## What this validates

- **A real 3D model load**, not a primitive built inline — `useGLTF`
  fetches and parses `crystals.glb`, and the result (`gltf.scene`, five
  named mesh nodes with their own materials) is rendered via
  `<primitive object={scene} />`.
- **Suspense scoped to just the model.** `CrystalModel` is wrapped in
  its own `<Suspense fallback={null}>` inside `Scene.tsx` — the lights,
  fog, stars and ground render immediately; only the model waits.
- **Post-processing.** `@react-three/postprocessing`'s `<Bloom>`, tuned
  by two config values, and skipped entirely — not just turned down —
  on mobile/low-power devices, since a multi-pass blur is one of the
  more expensive things a live preview here can do.
- **A second, distinct generated texture** (`grid-texture.ts`) on the
  ground plane, alongside crystal-gem's roughness map — same
  offscreen-canvas approach, no external image.
- **An animated light rig.** The two point lights orbit slowly inside a
  `<group>`, rotated once per frame — a cheap way to keep the scene
  feeling alive without animating the model itself.

## Configuration

| Key                | Type    | Default   | Group           |
| ------------------ | ------- | --------- | --------------- |
| `pointLightColor`  | color   | `#8b7cf6` | Lighting        |
| `ambientIntensity` | number  | `0.5`     | Lighting        |
| `autoRotate`       | boolean | `true`    | Animation       |
| `starCount`        | number  | `1200`    | Environment     |
| `bloomIntensity`   | number  | `1.2`     | Post-processing |
| `bloomThreshold`   | number  | `0.4`     | Post-processing |

Three presets ship alongside the schema — Default, Dim & still, and
Radiant — selectable from the Customize panel.
