import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-md bg-surface-raised [animation:px-pulse_1.6s_ease-in-out_infinite]",
        className
      )}
    />
  );
}