import type { ArtifactDefinition, ArtifactDifficulty } from "@/types/artifact";

export const SORT_OPTIONS = [
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
  { value: "difficulty-asc", label: "Difficulty (easiest first)" },
  { value: "difficulty-desc", label: "Difficulty (hardest first)" },
  { value: "category", label: "Category" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

const difficultyRank: Record<ArtifactDifficulty, number> = {
  Beginner: 0,
  Intermediate: 1,
  Advanced: 2,
  Experimental: 3,
};

export function sortArtifacts(
  source: ArtifactDefinition[],
  sort: SortOption
): ArtifactDefinition[] {
  const sorted = [...source];

  switch (sort) {
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "difficulty-asc":
      return sorted.sort(
        (a, b) => difficultyRank[a.difficulty] - difficultyRank[b.difficulty]
      );
    case "difficulty-desc":
      return sorted.sort(
        (a, b) => difficultyRank[b.difficulty] - difficultyRank[a.difficulty]
      );
    case "category":
      return sorted.sort((a, b) => a.category.localeCompare(b.category));
    default:
      return sorted;
  }
}