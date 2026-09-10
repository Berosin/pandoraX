"use client";

import { useMagnetic } from "./useMagnetic";
import type { ArtifactConfigValues } from "@/types/artifact";

export interface MagneticButtonProps extends Partial<ArtifactConfigValues> {
  label?: string;
  strength?: number;
  color?: string;
}

export default function MagneticButton({
  label = "Hover me",
  strength = 0.4,
  color = "#b98550",
}: MagneticButtonProps) {
  const { ref, onPointerMove, onPointerLeave } = useMagnetic({
    strength: Number(strength),
  });

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
        transform:
          "translate(var(--magnetic-x), var(--magnetic-y))",
      }}
      className="rounded-full border px-8 py-3 text-sm font-medium transition-transform duration-200 ease-out will-change-transform"
    >
      {label}
    </button>
  );
}
