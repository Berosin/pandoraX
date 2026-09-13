"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ArtifactGrid } from "./ArtifactGrid";
import { searchArtifacts } from "@/lib/search";
import { sortArtifacts, SORT_OPTIONS, type SortOption } from "@/lib/sort";
import { cn } from "@/lib/cn";
import {
  ARTIFACT_CATEGORIES,
  ARTIFACT_DIFFICULTIES,
  ARTIFACT_TECHNOLOGIES,
  type ArtifactCategory,
  type ArtifactDefinition,
  type ArtifactDifficulty,
  type ArtifactTechnology,
} from "@/types/artifact";

interface ArtifactExplorerProps {
  artifacts: ArtifactDefinition[];
  initialCategory?: ArtifactCategory | "All";
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-md border px-3.5 py-1.5 text-sm transition-colors",
        active
          ? "border-accent text-accent"
          : "border-border-strong text-foreground-dim hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

export function ArtifactExplorer({
  artifacts,
  initialCategory = "All",
}: ArtifactExplorerProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ArtifactCategory | "All">(
    initialCategory
  );
  const [difficulty, setDifficulty] = useState<ArtifactDifficulty | "All">(
    "All"
  );
  const [technology, setTechnology] = useState<ArtifactTechnology | "All">(
    "All"
  );
  const [sort, setSort] = useState<SortOption>("name-asc");

  const results = useMemo(() => {
    const filtered = searchArtifacts(artifacts, {
      query,
      category,
      difficulty,
      technology,
    });
    return sortArtifacts(filtered, sort);
  }, [artifacts, query, category, difficulty, technology, sort]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search artifacts…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search artifacts"
          className="max-w-sm"
        />

        <label className="flex items-center gap-2 text-sm text-muted">
          Sort
          <Select
            aria-label="Sort artifacts"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </label>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <p className="text-label mb-2.5 text-muted">Category</p>
          <div className="flex flex-wrap gap-2">
            <FilterChip active={category === "All"} onClick={() => setCategory("All")}>
              All
            </FilterChip>
            {ARTIFACT_CATEGORIES.map((option) => (
              <FilterChip
                key={option}
                active={category === option}
                onClick={() => setCategory(option)}
              >
                {option}
              </FilterChip>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-label mb-2.5 text-muted">Difficulty</p>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                active={difficulty === "All"}
                onClick={() => setDifficulty("All")}
              >
                All
              </FilterChip>
              {ARTIFACT_DIFFICULTIES.map((option) => (
                <FilterChip
                  key={option}
                  active={difficulty === option}
                  onClick={() => setDifficulty(option)}
                >
                  {option}
                </FilterChip>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-muted">
            Technology
            <Select
              aria-label="Filter by technology"
              value={technology}
              onChange={(event) =>
                setTechnology(event.target.value as ArtifactTechnology | "All")
              }
            >
              <option value="All">All</option>
              {ARTIFACT_TECHNOLOGIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </label>
        </div>
      </div>

      <p className="text-caption text-muted">
        {results.length} artifact{results.length === 1 ? "" : "s"}
      </p>

      <ArtifactGrid artifacts={results} />
    </div>
  );
}