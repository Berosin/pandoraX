"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — fail silently, nothing to recover.
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "text-xs font-medium text-bronze transition-opacity hover:underline",
        className
      )}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
