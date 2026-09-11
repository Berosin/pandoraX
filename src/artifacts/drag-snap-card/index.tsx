"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { ArtifactConfigValues } from "@/types/artifact";

const BOUND = 56; // px the card can be dragged from center before it's clamped

export interface DragSnapCardProps extends Partial<ArtifactConfigValues> {
  color?: string;
}

export default function DragSnapCard({ color = "#c2935f" }: DragSnapCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    if (!container || !card) return;

    // Scopes any gsap.to/gsap.set calls made anywhere below (including
    // inside the pointerup handler, fired later) so ctx.revert() on
    // cleanup kills them and reverts any inline styles gsap applied —
    // see PREVIEW_ARCHITECTURE.md.
    const ctx = gsap.context(() => {}, container);

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let originX = 0;
    let originY = 0;

    function onPointerDown(event: PointerEvent) {
      dragging = true;
      card!.setPointerCapture(event.pointerId);
      startX = event.clientX;
      startY = event.clientY;
      originX = (gsap.getProperty(card, "x") as number) || 0;
      originY = (gsap.getProperty(card, "y") as number) || 0;
      gsap.killTweensOf(card);
      card!.style.cursor = "grabbing";
    }

    function onPointerMove(event: PointerEvent) {
      if (!dragging) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      gsap.set(card, {
        x: gsap.utils.clamp(-BOUND, BOUND, originX + dx),
        y: gsap.utils.clamp(-BOUND, BOUND, originY + dy),
      });
    }

    function onPointerUp() {
      if (!dragging) return;
      dragging = false;
      card!.style.cursor = "grab";
      gsap.to(card, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
    }

    card.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      card.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex h-40 w-40 items-center justify-center sm:h-48 sm:w-48"
    >
      <div
        ref={cardRef}
        className="flex h-20 w-20 touch-none select-none items-center justify-center rounded-lg text-center text-xs font-medium"
        style={{ backgroundColor: color, color: "#0b0a08", cursor: "grab" }}
      >
        Drag me
      </div>
    </div>
  );
}