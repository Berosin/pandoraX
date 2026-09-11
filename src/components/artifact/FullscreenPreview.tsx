"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { PreviewFrame } from "@/components/preview/PreviewFrame";
import type { ArtifactConfigValues, ArtifactDefinition } from "@/types/artifact";

interface FullscreenPreviewProps {
  artifact: ArtifactDefinition;
  values: Partial<ArtifactConfigValues>;
  onClose: () => void;
}

export function FullscreenPreview({
  artifact,
  values,
  onClose,
}: FullscreenPreviewProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background [animation:px-fade-in_150ms_ease-out]">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <p className="text-sm font-medium text-foreground">{artifact.name}</p>
          <p className="text-xs text-muted">Fullscreen preview</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Exit fullscreen"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground-dim transition-colors hover:border-border-strong hover:text-foreground"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center p-8">
        <PreviewFrame artifact={artifact} values={values} />
      </div>
    </div>
  );
}