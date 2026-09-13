"use client";

import { useEffect, useRef } from "react";
import { Search, ChevronUp, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/cn";

interface SourceSearchProps {
  query: string;
  onQueryChange: (value: string) => void;
  matchCount: number;
  activeIndex: number;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
}

export function SourceSearch({
  query,
  onQueryChange,
  matchCount,
  activeIndex,
  onNext,
  onPrevious,
  onClose,
}: SourceSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) onPrevious();
      else onNext();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  }

  const hasQuery = query.trim().length > 0;

  return (
    <div className="flex items-center gap-1.5 rounded-md border border-border-strong bg-surface px-2 py-1">
      <Search size={13} className="shrink-0 text-muted" />
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search this file"
        className="w-28 bg-transparent text-xs text-foreground outline-none placeholder:text-muted sm:w-40"
      />
      {hasQuery && (
        <span
          className={cn(
            "shrink-0 whitespace-nowrap text-[11px] tabular-nums",
            matchCount > 0 ? "text-muted" : "text-muted/70"
          )}
        >
          {matchCount > 0 ? `${activeIndex + 1}/${matchCount}` : "0/0"}
        </span>
      )}
      <button
        type="button"
        onClick={onPrevious}
        disabled={matchCount === 0}
        aria-label="Previous match"
        className="rounded-sm p-0.5 text-muted transition-colors hover:text-foreground disabled:opacity-30 disabled:hover:text-muted"
      >
        <ChevronUp size={14} />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={matchCount === 0}
        aria-label="Next match"
        className="rounded-sm p-0.5 text-muted transition-colors hover:text-foreground disabled:opacity-30 disabled:hover:text-muted"
      >
        <ChevronDown size={14} />
      </button>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close search"
        className="rounded-sm p-0.5 text-muted transition-colors hover:text-foreground"
      >
        <X size={14} />
      </button>
    </div>
  );
}
