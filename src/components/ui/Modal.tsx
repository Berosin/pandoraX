"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export const Modal = DialogPrimitive.Root;
export const ModalTrigger = DialogPrimitive.Trigger;
export const ModalClose = DialogPrimitive.Close;

export function ModalContent({
  children,
  title,
  description,
  className,
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-[2px]",
          "data-[state=open]:[animation:px-fade-in_150ms_ease-out]"
        )}
      />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
          "rounded-lg border border-border bg-surface p-6 shadow-elevated",
          "data-[state=open]:[animation:px-pop-in_150ms_ease-out]",
          className
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <DialogPrimitive.Title className="text-h3 text-foreground">
              {title}
            </DialogPrimitive.Title>
            {description && (
              <DialogPrimitive.Description className="mt-1.5 text-caption text-muted">
                {description}
              </DialogPrimitive.Description>
            )}
          </div>
          <DialogPrimitive.Close className="shrink-0 rounded-sm p-1 text-muted transition-colors hover:bg-surface-raised hover:text-foreground">
            <X size={16} />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </div>

        <div className="mt-5">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}