"use client";

import { useEffect, useRef } from "react";

const BUFFER_SIZE = 64;
const DISPLAY_SIZE = 220;

export default function GrainOverlay() {
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

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let rafId: number | null = null;

    function renderFrame() {
      const image = bufferCtx!.createImageData(BUFFER_SIZE, BUFFER_SIZE);
      for (let i = 0; i < image.data.length; i += 4) {
        const value = Math.random() * 255;
        image.data[i] = value;
        image.data[i + 1] = value;
        image.data[i + 2] = value;
        image.data[i + 3] = 40; // constant low alpha — a grain wash, not noise soup
      }
      bufferCtx!.putImageData(image, 0, 0);

      ctx!.clearRect(0, 0, DISPLAY_SIZE, DISPLAY_SIZE);
      ctx!.imageSmoothingEnabled = false;
      ctx!.drawImage(buffer, 0, 0, DISPLAY_SIZE, DISPLAY_SIZE);
    }

    renderFrame();

    if (!prefersReduced) {
      const tick = () => {
        renderFrame();
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="relative h-40 w-40 overflow-hidden rounded-md bg-surface-raised sm:h-48 sm:w-48">
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