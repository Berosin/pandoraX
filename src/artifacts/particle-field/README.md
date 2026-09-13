# Particle Field

A cloud of GPU point sprites, each drifting on its own per-particle
noise offset — computed entirely in a vertex shader, not animated
individually on the CPU.

Part of Phase 11's advanced Three.js/WebGL set — the "particle system"
entry.

## What this validates

- **A real particle system.** `THREE.Points` with a custom
  `ShaderMaterial`: position offsets, point-size falloff by distance,
  and a soft circular sprite shape are all computed in `shaders.ts`.
- **Cheap reconfiguration.** Only `particleCount` rebuilds the
  geometry (a `useMemo` keyed on it); every other control — size,
  speed, noise scale, turbulence, color — updates a uniform, which is
  far cheaper than regenerating the buffer on every slider tick.
- **Manual disposal.** The `BufferGeometry` here is built imperatively
  (not as JSX), so it isn't covered by React Three Fiber's automatic
  disposal — this artifact calls `.dispose()` itself on unmount.
- **Mobile-aware particle count.** The configured count is capped
  further on touch/narrow devices (see `lib/use-device-capabilities.ts`)
  rather than rendering the full count regardless of hardware.

## Configuration

| Key             | Type   | Default   | Group      |
| --------------- | ------ | --------- | ---------- |
| `color`         | color  | `#6c9ceb` | Appearance |
| `particleSize`  | number | `2.4`     | Appearance |
| `speed`         | number | `0.6`     | Animation  |
| `particleCount` | number | `1500`    | Particles  |
| `noiseScale`    | number | `1`       | Particles  |
| `turbulence`    | number | `0.6`     | Particles  |

Four presets ship alongside the schema — Default, Calm dust, Dense
storm, and Violet swarm — selectable from the Customize panel.
