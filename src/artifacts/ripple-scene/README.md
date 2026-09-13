# Ripple Scene

A finely-subdivided plane, displaced in a vertex shader by ripples that
spawn wherever you click or drag — plus a subtle pointer-driven tilt
across the whole surface.

Part of Phase 11's advanced Three.js/WebGL set — the "mouse-reactive
WebGL scene" entry.

## What this validates

- **Vertex displacement driven by real interaction.** Pointer events
  raycast onto the mesh (React Three Fiber's built-in raycasting) feed
  world-space hit points into up to four concurrent ripple origins,
  each decaying over ~3 seconds in the vertex shader.
- **Continuous pointer influence**, not just discrete clicks — the
  whole surface tilts toward the pointer every frame via
  `useThree().pointer`, independent of the ripple system.
- **An idle animation that doesn't need you.** With "Idle ripples" on,
  the scene spawns a ripple at a random point every couple of seconds —
  so it still reads as alive while just scrolling past it in the gallery.
- **Array uniforms.** `uRippleOrigins[4]`/`uRippleTimes[4]` are mutated
  in place (a fixed pool of `THREE.Vector2`s and a plain number array)
  rather than reallocated on every ripple.

## Configuration

| Key              | Type    | Default   | Group       |
| ---------------- | ------- | --------- | ----------- |
| `color`          | color   | `#4fb8c9` | Appearance  |
| `rippleStrength` | number  | `0.4`     | Interaction |
| `mouseInfluence` | number  | `1`       | Interaction |
| `waveSpeed`      | number  | `1.2`     | Animation   |
| `autoRipple`     | boolean | `true`    | Animation   |

Three presets ship alongside the schema — Default, Still pond, and
Energetic — selectable from the Customize panel.
