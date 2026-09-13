import * as THREE from "three";

/** A small tiled grid — a second, distinct real-texture demonstration
 * alongside crystal-gem's roughness map, generated the same way (an
 * offscreen canvas, no external image asset). */
export function createGridTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#0c0b10";
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = "rgba(180, 170, 220, 0.35)";
  ctx.lineWidth = 2;

  const step = size / 8;
  for (let i = 0; i <= 8; i++) {
    const p = i * step;
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(size, p);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.needsUpdate = true;
  return texture;
}
