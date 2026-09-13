"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  Download,
  Loader2,
  AlertTriangle,
  Share2,
  Maximize2,
} from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/cn";
import type { DownloadState } from "@/lib/use-artifact-download";
import { DOWNLOAD_STATE_LABEL } from "@/lib/use-artifact-download";

interface ActionBarProps {
  onCopySource: () => Promise<boolean> | boolean;
  onGetSource: () => void;
  downloadState: DownloadState;
  downloadError: string | null;
  onShare: () => Promise<boolean> | boolean;
  onFullscreen: () => void;
}

function ActionButton({
  icon,
  label,
  onClick,
  disabled,
  tone = "default",
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: "default" | "accent" | "error";
}) {
  return (
    <Tooltip content={label}>
      <button
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-md border border-border-strong px-3 text-sm transition-colors",
          "disabled:cursor-wait",
          tone === "error"
            ? "border-border-strong text-muted"
            : tone === "accent"
              ? "border-accent text-accent"
              : "text-foreground-dim hover:border-accent hover:text-accent"
        )}
      >
        {icon}
        <span className="hidden sm:inline">{label}</span>
      </button>
    </Tooltip>
  );
}

export function ActionBar({
  onCopySource,
  onGetSource,
  downloadState,
  downloadError,
  onShare,
  onFullscreen,
}: ActionBarProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  async function handleCopy() {
    const ok = await onCopySource();
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  async function handleShare() {
    const ok = await onShare();
    if (ok) {
      setShared(true);
      setTimeout(() => setShared(false), 1500);
    }
  }

  const downloadBusy = downloadState === "preparing" || downloadState === "archiving";
  const downloadIcon =
    downloadState === "preparing" || downloadState === "archiving" ? (
      <Loader2 size={15} className="animate-spin" />
    ) : downloadState === "ready" ? (
      <Check size={15} />
    ) : downloadState === "error" ? (
      <AlertTriangle size={15} />
    ) : (
      <Download size={15} />
    );

  return (
    <div className="flex flex-wrap gap-2">
      <ActionButton
        icon={copied ? <Check size={15} /> : <Copy size={15} />}
        label={copied ? "Copied" : "Copy"}
        onClick={handleCopy}
      />
      <ActionButton
        icon={downloadIcon}
        label={downloadState === "error" && downloadError ? downloadError : DOWNLOAD_STATE_LABEL[downloadState]}
        onClick={onGetSource}
        disabled={downloadBusy}
        tone={downloadState === "error" ? "error" : downloadState === "ready" ? "accent" : "default"}
      />
      <ActionButton
        icon={<Share2 size={15} />}
        label={shared ? "Copied link" : "Share"}
        onClick={handleShare}
      />
      <ActionButton icon={<Maximize2 size={15} />} label="Fullscreen" onClick={onFullscreen} />
    </div>
  );
}
