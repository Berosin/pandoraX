"use client";

import { useMemo, useState } from "react";
import type { HighlightedLine } from "@/lib/syntax-highlight";

export interface SourceMatch {
  line: number;
  start: number;
  end: number;
}

/** Escapes regex metacharacters so the search box does plain substring
 * matching, not accidental pattern matching. */
function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

interface SearchState {
  lines: HighlightedLine[];
  query: string;
  index: number;
}

/**
 * Finds every occurrence of `query` across a file's lines (case
 * insensitive substring search, mirroring the "find in file" behavior
 * developers expect from an editor) and tracks which one is active.
 */
export function useSourceSearch(lines: HighlightedLine[], query: string) {
  const matches = useMemo<SourceMatch[]>(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];
    const pattern = new RegExp(escapeRegExp(trimmed), "gi");
    const found: SourceMatch[] = [];
    lines.forEach((line, index) => {
      pattern.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(line.text))) {
        found.push({ line: index, start: match.index, end: match.index + match[0].length });
        if (match[0].length === 0) pattern.lastIndex++;
      }
    });
    return found;
  }, [lines, query]);

  const [state, setState] = useState<SearchState>({ lines, query, index: 0 });

  // Switching file or editing the query invalidates the previous active
  // match — reset it here, during render, rather than in an effect (see
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes).
  let activeIndex = state.index;
  if (state.lines !== lines || state.query !== query) {
    activeIndex = 0;
    setState({ lines, query, index: 0 });
  }

  function goToNext() {
    if (matches.length === 0) return;
    setState((s) => ({ lines, query, index: (s.index + 1) % matches.length }));
  }

  function goToPrevious() {
    if (matches.length === 0) return;
    setState((s) => ({ lines, query, index: (s.index - 1 + matches.length) % matches.length }));
  }

  const active = matches[activeIndex] ?? null;

  return { matches, activeIndex, active, goToNext, goToPrevious };
}
