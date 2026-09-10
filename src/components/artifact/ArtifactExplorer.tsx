"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/Input";
import { ArtifactGrid } from "./ArtifactGrid";
import { searchArtifacts } from "@/lib/search";
import { cn } from "@/lib/cn";
import type { ArtifactCategory, ArtifactDefinition } from "@/types/artifact";

interface ArtifactExplorerProps {
  artifacts: ArtifactDefinition[];
  categories: ArtifactCategory[];
}

export function ArtifactExplorer({ artifacts, categories }: ArtifactExplorerProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ArtifactCategory | "All">(
    "All"
  );

  const results = useMemo(
    () => searchArtifacts(artifacts, { query, category: activeCategory }),
    [artifacts, query, activeCategory]
  );

  return (
    <div className="flex flex-col gap-8">
      <Input
        placeholder="Search artifacts…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        aria-label="Search artifacts"
        className="max-w-sm"
      />

      <div className="flex flex-wrap gap-2">
        {(["All", ...categories] as const).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              "rounded-md border px-3.5 py-1.5 text-sm transition-colors",
              activeCategory === category
                ? "border-accent text-accent"
                : "border-border-strong text-foreground-dim hover:text-foreground"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <ArtifactGrid artifacts={results} />
    </div>
  );
}