import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

type Tone = "neutral" | "accent" | "outline";

const toneStyles: Record<Tone, string> = {
  neutral: "bg-surface-raised text-foreground-dim",
  accent: "bg-accent-muted text-accent",
  outline: "border border-border-strong text-muted",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: { tone?: Tone } & HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium",
        toneStyles[tone],
        className
      )}
      {...props}
    />
  );
}