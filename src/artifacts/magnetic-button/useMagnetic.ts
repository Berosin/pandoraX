import { useRef } from "react";
import type { PointerEvent } from "react";

interface UseMagneticOptions {
  /** How strongly the element follows the pointer, 0–1. */
  strength: number;
}

/**
 * Tracks pointer position within an element and returns a transform
 * that pulls the element toward it, easing back to rest on leave.
 */
export function useMagnetic({ strength }: UseMagneticOptions) {
  const ref = useRef<HTMLButtonElement>(null);

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const bounds = el.getBoundingClientRect();
    const x = (event.clientX - bounds.left - bounds.width / 2) * strength;
    const y = (event.clientY - bounds.top - bounds.height / 2) * strength;
    el.style.setProperty("--magnetic-x", `${x}px`);
    el.style.setProperty("--magnetic-y", `${y}px`);
  };

  const onPointerLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--magnetic-x", "0px");
    el.style.setProperty("--magnetic-y", "0px");
  };

  return { ref, onPointerMove, onPointerLeave };
}
