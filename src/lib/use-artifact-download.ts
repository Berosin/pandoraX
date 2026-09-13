"use client";

import { useEffect, useRef, useState } from "react";

export type DownloadState =
  | "idle"
  | "preparing"
  | "archiving"
  | "ready"
  | "error";

export const DOWNLOAD_STATE_LABEL: Record<DownloadState, string> = {
  idle: "Get Source",
  preparing: "Preparing source…",
  archiving: "Creating archive…",
  ready: "Download ready",
  error: "Download failed",
};

/** Below this, the request finished so fast that flashing an
 * intermediate "Creating archive…" label would just be noise — above
 * it, showing the step is honest (the archive genuinely is still
 * being built server-side) rather than leaving a bare spinner. */
const ARCHIVING_LABEL_DELAY_MS = 350;
const RESET_DELAY_MS = 1800;
const ERROR_RESET_DELAY_MS = 3000;

/**
 * Drives the download of a single artifact's ZIP via the generic
 * /api/artifacts/[slug]/download route — nothing artifact-specific
 * lives here, it works for any slug the registry knows about.
 */
export function useArtifactDownload(slug: string) {
  const [state, setState] = useState<DownloadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const archivingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
      if (archivingTimer.current) clearTimeout(archivingTimer.current);
    };
  }, []);

  async function download() {
    if (state === "preparing" || state === "archiving") return;

    setError(null);
    setState("preparing");
    archivingTimer.current = setTimeout(() => setState("archiving"), ARCHIVING_LABEL_DELAY_MS);

    try {
      // Forwards whatever configuration is currently encoded in the
      // address bar (kept in sync by ArtifactWorkspace as the person
      // customizes) so the export reflects exactly what's on screen —
      // the same query string "Share Configuration" would copy.
      const query = typeof window !== "undefined" ? window.location.search : "";
      const response = await fetch(`/api/artifacts/${slug}/download${query}`);
      if (archivingTimer.current) clearTimeout(archivingTimer.current);

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? `Download failed (${response.status}).`);
      }

      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition") ?? "";
      const filenameMatch = disposition.match(/filename="([^"]+)"/);
      const filename = filenameMatch?.[1] ?? `${slug}.zip`;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      setState("ready");
      resetTimer.current = setTimeout(() => setState("idle"), RESET_DELAY_MS);
    } catch (err) {
      if (archivingTimer.current) clearTimeout(archivingTimer.current);
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
      resetTimer.current = setTimeout(() => setState("idle"), ERROR_RESET_DELAY_MS);
    }
  }

  return { state, error, download, label: DOWNLOAD_STATE_LABEL[state] };
}
