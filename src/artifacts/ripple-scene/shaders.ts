export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uRippleOrigins[4];
  uniform float uRippleTimes[4];
  uniform float uRippleStrength;
  uniform float uWaveSpeed;

  varying vec3 vNormal;
  varying float vElevation;

  float rippleContribution(vec2 origin, float startTime, vec2 pos, float time) {
    float age = time - startTime;
    if (startTime < 0.0 || age < 0.0 || age > 3.0) return 0.0;
    float dist = distance(pos, origin);
    float wave = sin(dist * 8.0 - age * 6.0) * exp(-age * 1.5) * exp(-dist * 1.2);
    return wave;
  }

  void main() {
    vec3 pos = position;
    float elevation = 0.0;
    for (int i = 0; i < 4; i++) {
      elevation += rippleContribution(uRippleOrigins[i], uRippleTimes[i], position.xy, uTime);
    }
    elevation *= uRippleStrength;
    elevation += sin(position.x * 2.0 + uTime * uWaveSpeed) * 0.03;

    pos.z += elevation;
    vElevation = elevation;
    vNormal = normalMatrix * normal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying vec3 vNormal;
  varying float vElevation;

  void main() {
    vec3 normal = normalize(vNormal);
    float diffuse = max(dot(normal, normalize(vec3(0.4, 0.6, 1.0))), 0.0);
    vec3 base = uColor * (0.45 + diffuse * 0.6);
    vec3 highlight = vec3(1.0) * smoothstep(0.0, 0.3, vElevation) * 0.6;
    gl_FragColor = vec4(base + highlight, 1.0);
  }
`;
