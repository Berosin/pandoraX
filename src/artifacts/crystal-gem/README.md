# Crystal Gem

A faceted icosahedron rendered with a physically-based material —
metalness, roughness and clearcoat — plus a generated roughness texture
for surface variation. Drag to orbit it; it auto-rotates when idle.

Part of Phase 11's advanced Three.js/WebGL set — the "interactive 3D
object" entry, demonstrating real-time PBR lighting and a genuine
`THREE.CanvasTexture` (procedurally generated, not an external image
asset).

## What this validates

- **Physically-based rendering.** `MeshPhysicalMaterial` with live
  metalness/roughness/clearcoat controls — real PBR, not a flat color.
- **A real generated texture.** `facet-texture.ts` builds a small
  `CanvasTexture` on an offscreen canvas at mount time and disposes it
  explicitly on unmount — it isn't JSX-created, so React Three Fiber's
  automatic disposal doesn't cover it; this artifact handles that itself.
- **Interactive camera control.** Drei's `OrbitControls`, toggleable via
  config — dragging to inspect the gem from any angle.
- **Mobile-aware detail.** Geometry subdivision drops a level and the
  device pixel ratio cap lowers on touch/narrow viewports (see
  `lib/use-device-capabilities.ts`), rather than hiding the artifact.
- **`prefers-reduced-motion` respected.** Auto-rotate is skipped
  entirely when the browser reports a reduced-motion preference.

## Configuration

| Key            | Type    | Default   | Group       |
| -------------- | ------- | --------- | ----------- |
| `color`        | color   | `#8b7cf6` | Appearance  |
| `metalness`    | number  | `0.4`     | Appearance  |
| `roughness`    | number  | `0.15`    | Appearance  |
| `autoRotate`   | boolean | `true`    | Animation   |
| `rotationSpeed`| number  | `0.4`     | Animation   |
| `dragToRotate` | boolean | `true`    | Interaction |

Four presets ship alongside the schema — Default, Amethyst, Gold, and
Obsidian — selectable from the Customize panel.
