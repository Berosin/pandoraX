import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

type Tone = "neutral" | "bronze" | "outline";

const toneStyles: Record<Tone, string> = {
  neutral: "bg-surface-raised text-cream-dim",
  bronze: "bg-bronze-dim/30 text-bronze",
  outline: "border border-line-strong text-muted",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: { tone?: Tone } & HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        toneStyles[tone],
        className
      )}
      {...props}
    />
  );
}
