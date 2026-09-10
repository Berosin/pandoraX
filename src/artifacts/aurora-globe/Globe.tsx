"use client";

import { useEffect, useRef } from "react";
import { valueNoise2D } from "./utils/noise";
import { getArtifactAssetUrl } from "@/lib/artifact-assets";

const BUFFER_SIZE = 44;
const DISPLAY_SIZE = 320;

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const value = parseInt(clean.length === 3 ? clean.repeat(2) : clean, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

interface GlobeProps {
  colorA?: string;
  colorB?: string;
  speed?: number;
}

export function Globe({
  colorA = "#3aa88c",
  colorB = "#7859c8",
  speed = 0.08,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const buffer = document.createElement("canvas");
    buffer.width = BUFFER_SIZE;
    buffer.height = BUFFER_SIZE;
    const bufferCtx = buffer.getContext("2d");
    if (!bufferCtx) return;

    const rgbA = hexToRgb(colorA);
    const rgbB = hexToRgb(colorB);
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let rafId: number | null = null;
    const startTime = performance.now();

    function renderFrame(elapsedMs: number) {
      const t = (elapsedMs / 1000) * speed;
      const image = bufferCtx!.createImageData(BUFFER_SIZE, BUFFER_SIZE);
      const center = BUFFER_SIZE / 2;

      for (let y = 0; y < BUFFER_SIZE; y++) {
        for (let x = 0; x < BUFFER_SIZE; x++) {
          const dx = (x - center) / center;
          const dy = (y - center) / center;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const n =
            valueNoise2D(x * 0.14, y * 0.14 + t, 1) * 0.65 +
            valueNoise2D(x * 0.3 + t * 1.4, y * 0.3, 2) * 0.35;

          // Globe shading: darker toward the rim, brighter near an
          // upper-left "light source" — sells the sphere illusion
          // without any actual 3D geometry.
          const rim = Math.max(0, 1 - dist * 1.05);
          const light = Math.max(
            0,
            1 - Math.hypot(dx + 0.4, dy + 0.4) * 0.9
          );
          const shade = Math.min(1, rim * (0.35 + n * 0.65) + light * 0.25);

          const idx = (y * BUFFER_SIZE + x) * 4;
          image.data[idx] = rgbA[0] + (rgbB[0] - rgbA[0]) * n;
          image.data[idx + 1] = rgbA[1] + (rgbB[1] - rgbA[1]) * n;
          image.data[idx + 2] = rgbA[2] + (rgbB[2] - rgbA[2]) * n;
          image.data[idx + 3] = dist > 1 ? 0 : 255 * shade;
        }
      }

      bufferCtx!.putImageData(image, 0, 0);

      ctx!.clearRect(0, 0, DISPLAY_SIZE, DISPLAY_SIZE);
      ctx!.imageSmoothingEnabled = true;
      ctx!.drawImage(buffer, 0, 0, DISPLAY_SIZE, DISPLAY_SIZE);
    }

    renderFrame(0);

    if (!prefersReduced) {
      const tick = (now: number) => {
        renderFrame(now - startTime);
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [colorA, colorB, speed]);

  return (
    <div
      className="relative h-40 w-40 overflow-hidden rounded-full sm:h-48 sm:w-48"
      style={{
        backgroundImage: `url(${getArtifactAssetUrl({ slug: "aurora-globe" }, "texture.png")})`,
        backgroundSize: "cover",
      }}
    >
      <canvas
        ref={canvasRef}
        width={DISPLAY_SIZE}
        height={DISPLAY_SIZE}
        className="h-full w-full"
        aria-hidden
      />
    </div>
  );
}