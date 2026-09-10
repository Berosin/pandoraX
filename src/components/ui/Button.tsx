import { cn } from "@/lib/cn";
import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface BaseProps {
  variant?: Variant;
  className?: string;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-cream text-void hover:bg-cream/90",
  secondary:
    "border border-line-strong text-cream hover:border-bronze hover:text-bronze",
  ghost: "text-cream-dim hover:text-cream",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none";

export function Button({
  variant = "primary",
  className,
  ...props
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variantStyles[variant], className)}
      {...props}
    />
  );
}

export function LinkButton({
  variant = "primary",
  className,
  href,
  ...props
}: BaseProps & { href: string } & React.ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={cn(base, variantStyles[variant], className)}
      {...props}
    />
  );
}
