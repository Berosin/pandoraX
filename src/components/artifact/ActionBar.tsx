"use client";

import { useState } from "react";
import { Copy, Check, FileCode, Share2, Maximize2 } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/cn";

interface ActionBarProps {
  onCopySource: () => Promise<boolean> | boolean;
  onGetSource: () => void;
  onShare: () => Promise<boolean> | boolean;
  onFullscreen: () => void;
}

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Tooltip content={label}>
      <button
        onClick={onClick}
        aria-label={label}
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-md border border-border-strong px-3 text-sm text-foreground-dim transition-colors",
          "hover:border-accent hover:text-accent"
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

  return (
    <div className="flex flex-wrap gap-2">
      <ActionButton
        icon={copied ? <Check size={15} /> : <Copy size={15} />}
        label={copied ? "Copied" : "Copy"}
        onClick={handleCopy}
      />
      <ActionButton icon={<FileCode size={15} />} label="Get Source" onClick={onGetSource} />
      <ActionButton
        icon={<Share2 size={15} />}
        label={shared ? "Copied link" : "Share"}
        onClick={handleShare}
      />
      <ActionButton icon={<Maximize2 size={15} />} label="Fullscreen" onClick={onFullscreen} />
    </div>
  );
}