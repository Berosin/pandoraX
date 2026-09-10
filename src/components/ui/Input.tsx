import { cn } from "@/lib/cn";
import type { InputHTMLAttributes } from "react";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-full border border-line-strong bg-surface px-5 py-3 text-sm text-cream placeholder:text-muted outline-none transition-colors focus:border-bronze",
        className
      )}
      {...props}
    />
  );
}
