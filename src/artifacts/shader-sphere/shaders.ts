export const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uWaveSpeed;
  uniform float uGlowIntensity;

  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.0);
    float wave = sin(vPosition.y * 4.0 + uTime * uWaveSpeed) * 0.5 + 0.5;

    vec3 color = mix(uColorA, uColorB, wave);
    gl_FragColor = vec4(color * (0.4 + fresnel * uGlowIntensity), 1.0);
  }
`;
