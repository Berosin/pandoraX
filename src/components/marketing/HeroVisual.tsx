"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { CSSProperties } from "react";

const MAX_TILT = 9; // degrees
const SETTLE_EPSILON = 0.02;
const LERP = 0.08;

export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const container = containerRef.current;
    if (!container) return;

    function ensureLoop() {
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    function handlePointerMove(event: PointerEvent) {
      const bounds = container!.getBoundingClientRect();
      const cx = bounds.left + bounds.width / 2;
      const cy = bounds.top + bounds.height / 2;
      const dx = (event.clientX - cx) / (bounds.width / 2);
      const dy = (event.clientY - cy) / (bounds.height / 2);
      targetRef.current = {
        x: Math.max(-1, Math.min(1, dx)) * MAX_TILT,
        y: Math.max(-1, Math.min(1, dy)) * -MAX_TILT,
      };
      ensureLoop();
    }

    function handlePointerLeave() {
      targetRef.current = { x: 0, y: 0 };
      ensureLoop();
    }

    function tick() {
      const current = currentRef.current;
      const target = targetRef.current;
      current.x += (target.x - current.x) * LERP;
      current.y += (target.y - current.y) * LERP;

      container!.style.setProperty("--tilt-x", `${current.x.toFixed(2)}deg`);
      container!.style.setProperty("--tilt-y", `${current.y.toFixed(2)}deg`);

      const settled =
        Math.abs(target.x - current.x) < SETTLE_EPSILON &&
        Math.abs(target.y - current.y) < SETTLE_EPSILON &&
        target.x === 0 &&
        target.y === 0;

      if (settled) {
        rafRef.current = null;
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="relative mx-auto flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64"
      style={{ perspective: "900px" }}
    >
      <div
        aria-hidden
        className="absolute inset-0 rounded-full bg-accent/20 blur-[64px]"
      />
      <div
        ref={containerRef}
        className="relative will-change-transform"
        style={
          {
            "--tilt-x": "0deg",
            "--tilt-y": "0deg",
            transform:
              "rotateX(var(--tilt-y)) rotateY(var(--tilt-x))",
          } as CSSProperties
        }
      >
        <Image
          src="/brand/pandorax-mark.png"
          alt="PandoraX"
          width={176}
          height={176}
          priority
          className="rounded-2xl"
        />
      </div>
    </div>
  );
}