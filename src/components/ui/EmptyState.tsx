import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
  bordered?: boolean;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
  bordered = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center px-6 py-20 text-center",
        bordered && "rounded-lg border border-dashed border-border-strong",
        className
      )}
    >
      {icon && <div className="mb-4 text-muted">{icon}</div>}
      <p className="text-h3 text-foreground">{title}</p>
      {description && (
        <p className="mt-2 max-w-sm text-body text-muted">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}