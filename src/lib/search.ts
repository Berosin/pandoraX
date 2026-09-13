import type {
  ArtifactCategory,
  ArtifactDefinition,
  ArtifactDifficulty,
  ArtifactTechnology,
} from "@/types/artifact";

export interface ArtifactSearchOptions {
  query?: string;
  category?: ArtifactCategory | "All";
  technology?: ArtifactTechnology | "All";
  difficulty?: ArtifactDifficulty | "All";
}

export function searchArtifacts(
  source: ArtifactDefinition[],
  { query, category, technology, difficulty }: ArtifactSearchOptions
): ArtifactDefinition[] {
  let results = source;

  if (category && category !== "All") {
    results = results.filter((artifact) => artifact.category === category);
  }

  if (technology && technology !== "All") {
    results = results.filter((artifact) =>
      artifact.technologies.includes(technology)
    );
  }

  if (difficulty && difficulty !== "All") {
    results = results.filter((artifact) => artifact.difficulty === difficulty);
  }

  const normalizedQuery = query?.trim().toLowerCase();
  if (normalizedQuery) {
    results = results.filter((artifact) => {
      const haystack = [
        artifact.name,
        artifact.description,
        artifact.category,
        ...artifact.technologies,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }

  return results;
}