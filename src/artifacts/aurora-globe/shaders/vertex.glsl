// Aurora Globe — vertex shader (reference implementation)
//
// This is the planned vertex stage for the WebGL version of this artifact,
// shipped as source for review, but not yet wired to a live GPU context.
// The card you're previewing right now renders a Canvas2D fallback instead
// (see ../index.tsx) — this file lands with the PandoraX WebGL preview
// engine (see /src/lib/download.ts and README.md in this folder).

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}