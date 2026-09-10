import { cn } from "@/lib/cn";
import type { InputHTMLAttributes } from "react";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-md border border-border-strong bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-accent",
        className
      )}
      {...props}
    />
  );
}