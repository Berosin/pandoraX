export const vertexShader = /* glsl */ `
  attribute vec2 aPosition;

  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uScale;
  uniform float uWarp;

  // Cheap layered-sine field — a compact stand-in for real simplex
  // noise, plenty for a soft, flowing background gradient.
  float wave(vec2 p, float t) {
    return sin(p.x * 1.7 + t) + sin(p.y * 1.3 - t * 0.8) + sin((p.x + p.y) * 0.9 + t * 1.3);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
    vec2 p = uv * uScale;

    vec2 warped = p + uWarp * vec2(wave(p, uTime), wave(p + 4.2, uTime * 1.1));
    float n = wave(warped, uTime) * 0.5 + 0.5;

    vec3 color = mix(uColorA, uColorB, clamp(n, 0.0, 1.0));
    gl_FragColor = vec4(color, 1.0);
  }
`;
