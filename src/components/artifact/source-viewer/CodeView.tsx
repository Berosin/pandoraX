"use client";

import { useEffect, useRef } from "react";
import type { LoadedArtifactFile } from "@/lib/artifact-loader";
import type { SourceMatch } from "./use-source-search";
import { CodeLine } from "./CodeLine";

export function CodeView({
  file,
  matches,
  activeIndex,
}: {
  file: LoadedArtifactFile;
  matches: SourceMatch[];
  activeIndex: number;
}) {
  const activeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "center", inline: "nearest" });
  }, [activeIndex, file.path]);

  const matchesByLine = new Map<number, SourceMatch[]>();
  matches.forEach((match, index) => {
    const list = matchesByLine.get(match.line) ?? [];
    list.push({ ...match, __index: index } as SourceMatch & { __index: number });
    matchesByLine.set(match.line, list);
  });

  return (
    <div className="h-full overflow-auto bg-surface">
      <div className="min-w-max py-3">
        {file.lines.map((line, i) => {
          const lineMatches = (matchesByLine.get(i) as (SourceMatch & { __index: number })[] | undefined)?.map(
            (m) => ({ start: m.start, end: m.end, isActive: m.__index === activeIndex })
          ) ?? [];
          return (
            <CodeLine
              key={i}
              lineNumber={i + 1}
              tokens={line.tokens}
              lineMatches={lineMatches}
              activeMatchRef={
                lineMatches.some((m) => m.isActive)
                  ? (el) => {
                      activeRef.current = el;
                    }
                  : undefined
              }
            />
          );
        })}
      </div>
    </div>
  );
}
