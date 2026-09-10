// Aurora Globe — fragment shader (reference implementation)
//
// Fresnel-driven rim light plus two drifting color bands, meant to be
// combined with a low-frequency noise texture (see ../assets/texture.png)
// for the aurora bands themselves. Reference-only for now — see the note
// in vertex.glsl.

uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform sampler2D uNoiseTexture;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 viewDir = normalize(-vPosition);
  float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.5);

  vec2 driftedUv = vUv + vec2(uTime * 0.015, uTime * 0.008);
  float band = texture2D(uNoiseTexture, driftedUv).r;

  vec3 aurora = mix(uColorA, uColorB, band);
  vec3 color = aurora * fresnel + aurora * 0.08;

  gl_FragColor = vec4(color, fresnel * 0.9 + 0.1);
}