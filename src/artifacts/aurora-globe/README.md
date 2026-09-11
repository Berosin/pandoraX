# Aurora Globe

A slowly drifting, noise-shaded sphere of aurora color. Built to validate
PandoraX's multi-file artifact architecture: a nested folder structure,
shader source, a binary texture asset, and documentation living alongside
the code.

## What's actually running right now

The live preview is a **Canvas2D fallback** (`Globe.tsx`): a small noise
buffer, generated with `utils/noise.ts`, upscaled and clipped to a circle,
with simple radial shading standing in for real sphere lighting. The
`texture.png` asset sits behind it as a soft backdrop.

## What's planned

`shaders/vertex.glsl` and `shaders/fragment.glsl` are a reference
implementation for the WebGL version of this artifact — a real sphere
mesh, a fresnel rim light, and a drifting noise-texture sample for the
aurora bands. They are **not wired to a live GPU context yet**. That
lands with PandoraX's WebGL preview engine — see `artifacts/shader-sphere`
for a live example of these exact techniques (fresnel rim light, GLSL
uniforms) running on a real `<Canvas>`.

## Configuration

| Key      | Type   | Default   | Notes                          |
| -------- | ------ | --------- | ------------------------------ |
| `colorA` | color  | `#3aa88c` | Primary aurora tone            |
| `colorB` | color  | `#7859c8` | Secondary aurora tone          |
| `speed`  | number | `0.08`    | Drift speed of the noise field |

## Files

```
aurora-globe/
├── index.tsx           entry point
├── Globe.tsx            the live Canvas2D component
├── shaders/
│   ├── vertex.glsl      reference implementation (not yet active)
│   └── fragment.glsl    reference implementation (not yet active)
├── utils/
│   └── noise.ts          2D value-noise, used by Globe.tsx
├── assets/
│   └── texture.png       backdrop texture
├── README.md             this file
├── package.json
└── LICENSE.md
```