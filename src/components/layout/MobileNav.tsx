"use client";

import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { primaryNav } from "@/lib/site";
import { cn } from "@/lib/cn";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger
        aria-label="Open menu"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground-dim md:hidden"
      >
        <Menu size={18} />
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-background/80 backdrop-blur-[2px] md:hidden",
            "data-[state=open]:[animation:px-fade-in_150ms_ease-out]"
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex w-72 max-w-[85vw] flex-col gap-1 border-l border-border bg-surface p-6 md:hidden",
            "data-[state=open]:[animation:px-slide-in-right_180ms_ease-out]"
          )}
        >
          <div className="mb-6 flex items-center justify-between">
            <DialogPrimitive.Title className="text-label text-muted">
              Menu
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              aria-label="Close menu"
              className="text-foreground-dim"
            >
              <X size={18} />
            </DialogPrimitive.Close>
          </div>

          {primaryNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm text-foreground-dim transition-colors hover:bg-surface-raised hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}