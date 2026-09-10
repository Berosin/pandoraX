/**
 * A small, dependency-free 2D value-noise function. Not simplex- or
 * Perlin-grade, but cheap and smooth enough for gentle organic motion —
 * exactly what a canvas-based aurora fallback needs.
 */
function hash(x: number, y: number, seed: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
  return s - Math.floor(s);
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

export function valueNoise2D(x: number, y: number, seed = 0): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;

  const topLeft = hash(xi, yi, seed);
  const topRight = hash(xi + 1, yi, seed);
  const bottomLeft = hash(xi, yi + 1, seed);
  const bottomRight = hash(xi + 1, yi + 1, seed);

  const u = smoothstep(xf);
  const v = smoothstep(yf);

  const top = topLeft + u * (topRight - topLeft);
  const bottom = bottomLeft + u * (bottomRight - bottomLeft);
  return top + v * (bottom - top);
}