"use client";

import { useMagnetic } from "./useMagnetic";
import type { ArtifactConfigValues } from "@/types/artifact";

export interface MagneticButtonProps extends Partial<ArtifactConfigValues> {
  label?: string;
  /** 0–1 — how strongly the button follows the pointer. */
  strength?: number;
  color?: string;
  /** Corner radius in px. The default (999) renders as a full pill. */
  radius?: number;
  /** Adds a soft box-shadow glow in `color` around the button. */
  glow?: boolean;
  fontSize?: number;
  /** How long the return-to-rest tween takes, in ms. */
  duration?: number;
  easing?: string;
}

/** Maps the schema's `easing` select options to real CSS timing
 * functions — "back" has no CSS keyword, so it's approximated with a
 * cubic-bezier overshoot. */
const EASING_MAP: Record<string, string> = {
  "ease-out": "ease-out",
  "ease-in-out": "ease-in-out",
  linear: "linear",
  back: "cubic-bezier(0.34, 1.56, 0.64, 1)",
};

export default function MagneticButton({
  label = "Hover me",
  strength = 0.4,
  color = "#b98550",
  radius = 999,
  glow = false,
  fontSize = 14,
  duration = 200,
  easing = "ease-out",
}: MagneticButtonProps) {
  const { ref, onPointerMove, onPointerLeave } = useMagnetic({
    strength: Number(strength),
  });
  const timingFunction = EASING_MAP[String(easing)] ?? "ease-out";

  return (
    <button
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{
        // @ts-expect-error -- custom property, read by the transform below
        "--magnetic-x": "0px",
        "--magnetic-y": "0px",
        borderColor: color,
        color,
        borderRadius: `${radius}px`,
        fontSize: `${fontSize}px`,
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: timingFunction,
        boxShadow: glow ? `0 0 24px 4px ${color}66` : "0 0 0 0 transparent",
        transform: "translate(var(--magnetic-x), var(--magnetic-y))",
      }}
      className="border px-8 py-3 font-medium transition-[transform,box-shadow,border-radius] will-change-transform"
    >
      {label}
    </button>
  );
}
