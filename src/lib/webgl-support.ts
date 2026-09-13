/**
 * True if the browser can actually give us a WebGL2 context. Used only
 * by artifacts that manage their own `<canvas>` directly (raw WebGL,
 * not react-three-fiber) — R3F/Three-based artifacts don't need this
 * check themselves, since a failed WebGL init there throws and is
 * already caught by the shared ArtifactErrorBoundary every preview is
 * wrapped in (see components/preview/PreviewFrame.tsx).
 */
export function isWebGLAvailable(): boolean {
  if (typeof document === "undefined") return true; // SSR: assume yes, corrected on mount
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}
