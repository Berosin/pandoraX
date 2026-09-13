export const vertexShader = /* glsl */ `
  attribute float aSeed;

  uniform float uTime;
  uniform float uSize;
  uniform float uSpeed;
  uniform float uNoiseScale;
  uniform float uTurbulence;
  uniform float uDpr;

  varying float vAlpha;

  void main() {
    float angle = uTime * uSpeed + aSeed * 6.2831853;
    vec3 offset = vec3(
      sin(angle + position.x * uNoiseScale),
      cos(angle * 1.3 + position.y * uNoiseScale),
      sin(angle * 0.7 + position.z * uNoiseScale)
    ) * uTurbulence;

    vec3 pos = position + offset;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    gl_PointSize = uSize * uDpr * (300.0 / -mvPosition.z);
    vAlpha = clamp(1.0 - (-mvPosition.z * 0.12), 0.25, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    vec2 centered = gl_PointCoord - vec2(0.5);
    float dist = length(centered);
    float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
    gl_FragColor = vec4(uColor, alpha);
  }
`;
