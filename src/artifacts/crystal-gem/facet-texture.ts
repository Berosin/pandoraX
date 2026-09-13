import * as THREE from "three";

/**
 * Builds a small tiled roughness-variation texture on an offscreen
 * canvas — irregular faceted speckling so the gem's surface doesn't
 * read as a flat, uniform material. A genuine `THREE.CanvasTexture`,
 * not a placeholder: generated once and reused for the component's
 * lifetime, disposed by the caller on unmount.
 */
export function createFacetTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#8a8a8a";
  ctx.fillRect(0, 0, size, size);

  // Cheap value-noise speckle: enough visual grain to break up the
  // material without needing a real noise library for a 128x128 map.
  const imageData = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const grain = 120 + Math.random() * 100;
    imageData.data[i] = grain;
    imageData.data[i + 1] = grain;
    imageData.data[i + 2] = grain;
    imageData.data[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.needsUpdate = true;
  return texture;
}
