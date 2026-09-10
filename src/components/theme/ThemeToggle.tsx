"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/cn";

const subscribe = () => () => {};

/** True only once the client has hydrated — avoids a dark/light mismatch
 * between the server render and next-themes' post-hydration value. */
function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <Tooltip content={isDark ? "Switch to light" : "Switch to dark"}>
      <button
        type="button"
        aria-label="Toggle theme"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground-dim transition-colors hover:border-border-strong hover:text-foreground",
          className
        )}
      >
        {mounted && (isDark ? <Sun size={16} /> : <Moon size={16} />)}
      </button>
    </Tooltip>
  );
}