import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

export function Section({
  className,
  divider = false,
  ...props
}: HTMLAttributes<HTMLElement> & { divider?: boolean }) {
  return (
    <section
      className={cn(
        "py-16 sm:py-20 lg:py-24",
        divider && "border-b border-border",
        className
      )}
      {...props}
    />
  );
}