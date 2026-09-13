"use client";

import { useEffect, useState } from "react";

export interface DeviceCapabilities {
  /** Coarse pointer (touch-primary) or a narrow viewport — the signal
   * every WebGL demo artifact here uses to cut particle/geometry
   * counts and disable post-processing. */
  isMobile: boolean;
  /** Mirrors the `prefers-reduced-motion` media query — continuous
   * idle animation (auto-rotate, drifting particles) is paused or
   * slowed when this is true. */
  prefersReducedMotion: boolean;
  /** A rough, non-scientific proxy for "modest hardware" — low core
   * count generally correlates with weaker GPUs too. */
  isLowPower: boolean;
}

const SSR_DEFAULT: DeviceCapabilities = {
  isMobile: false,
  prefersReducedMotion: false,
  isLowPower: false,
};

function read(): DeviceCapabilities {
  if (typeof window === "undefined") return SSR_DEFAULT;
  const isMobile =
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(max-width: 640px)").matches;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const isLowPower = (navigator.hardwareConcurrency ?? 8) <= 4;
  return { isMobile, prefersReducedMotion, isLowPower };
}

/**
 * Coarse, honest device signals for scaling a WebGL scene's detail
 * down rather than hiding it outright — see each Phase 11 artifact's
 * `getDetailLevel`-style branch for how these translate into fewer
 * particles, a lower DPR cap, or skipped post-processing.
 *
 * Starts from SSR-safe defaults (assume capable) and corrects itself
 * on mount, matching how every other client-only measurement in this
 * codebase (useInViewport, etc.) avoids a hydration mismatch.
 */
export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>(SSR_DEFAULT);

  useEffect(() => {
    // Deliberate: this is the standard SSR-safe pattern (start from a
    // fixed default so server and first client render match, then
    // correct once real browser signals are available post-mount) —
    // not something a lazy useState initializer can do, since that
    // would run during SSR too and produce a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCapabilities(read());

    const pointerQuery = window.matchMedia("(pointer: coarse)");
    const widthQuery = window.matchMedia("(max-width: 640px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => setCapabilities(read());
    pointerQuery.addEventListener("change", update);
    widthQuery.addEventListener("change", update);
    motionQuery.addEventListener("change", update);

    return () => {
      pointerQuery.removeEventListener("change", update);
      widthQuery.removeEventListener("change", update);
      motionQuery.removeEventListener("change", update);
    };
  }, []);

  return capabilities;
}
