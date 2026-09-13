import { cn } from "@/lib/cn";
import type { CodeToken } from "@/lib/syntax-highlight";

interface LineMatch {
  start: number;
  end: number;
  isActive: boolean;
}

interface Segment {
  text: string;
  isMatch: boolean;
  isActive: boolean;
}

/** Splits one token's text into normal / matched sub-segments using
 * line-relative match ranges, so search highlighting can cut across
 * token (i.e. syntax-color) boundaries without losing either. */
function splitToken(content: string, tokenStart: number, lineMatches: LineMatch[]): Segment[] {
  const tokenEnd = tokenStart + content.length;
  const relevant = lineMatches
    .map((m) => ({
      start: Math.max(0, m.start - tokenStart),
      end: Math.min(content.length, m.end - tokenStart),
      isActive: m.isActive,
    }))
    .filter((m) => m.start < m.end)
    .sort((a, b) => a.start - b.start);

  if (relevant.length === 0) return [{ text: content, isMatch: false, isActive: false }];

  const segments: Segment[] = [];
  let cursor = 0;
  for (const m of relevant) {
    if (m.start > cursor) {
      segments.push({ text: content.slice(cursor, m.start), isMatch: false, isActive: false });
    }
    segments.push({ text: content.slice(m.start, m.end), isMatch: true, isActive: m.isActive });
    cursor = m.end;
  }
  if (cursor < content.length) {
    segments.push({ text: content.slice(cursor), isMatch: false, isActive: false });
  }
  void tokenEnd;
  return segments;
}

export function CodeLine({
  lineNumber,
  tokens,
  lineMatches,
  activeMatchRef,
}: {
  lineNumber: number;
  tokens: CodeToken[];
  lineMatches: LineMatch[];
  activeMatchRef?: (el: HTMLElement | null) => void;
}) {
  // Functional prefix-sum: each token paired with its character offset
  // within the line, without mutating a shared cursor across iterations.
  const positioned = tokens.reduce<{ token: CodeToken; start: number }[]>((acc, token) => {
    const prev = acc[acc.length - 1];
    const start = prev ? prev.start + prev.token.content.length : 0;
    return [...acc, { token, start }];
  }, []);

  return (
    <div className="flex min-w-full">
      <span className="sticky left-0 w-10 shrink-0 select-none bg-surface pr-3 text-right font-mono text-[11px] leading-6 text-muted/70 sm:w-12">
        {lineNumber}
      </span>
      <span className="flex-1 whitespace-pre pl-3 font-mono text-[12.5px] leading-6 text-foreground-dim">
        {positioned.length === 0 && "\u00A0"}
        {positioned.map(({ token, start }, tokenIndex) => {
          const segments = lineMatches.length
            ? splitToken(token.content, start, lineMatches)
            : [{ text: token.content, isMatch: false, isActive: false }];

          return (
            <span
              key={tokenIndex}
              style={{ color: token.color }}
              className={cn(token.bold && "font-semibold", token.italic && "italic")}
            >
              {segments.map((segment, segmentIndex) =>
                segment.isMatch ? (
                  <mark
                    key={segmentIndex}
                    ref={segment.isActive ? activeMatchRef : undefined}
                    className={cn(
                      "rounded-[2px] text-inherit",
                      segment.isActive
                        ? "bg-accent/45 outline outline-1 outline-accent"
                        : "bg-accent/20"
                    )}
                  >
                    {segment.text}
                  </mark>
                ) : (
                  <span key={segmentIndex}>{segment.text}</span>
                )
              )}
            </span>
          );
        })}
      </span>
    </div>
  );
}
