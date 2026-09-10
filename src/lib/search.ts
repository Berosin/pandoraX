import type { ArtifactCategory, ArtifactDefinition } from "@/types/artifact";

export interface ArtifactSearchOptions {
  query?: string;
  category?: ArtifactCategory | "All";
}

export function searchArtifacts(
  source: ArtifactDefinition[],
  { query, category }: ArtifactSearchOptions
): ArtifactDefinition[] {
  let results = source;

  if (category && category !== "All") {
    results = results.filter((artifact) => artifact.category === category);
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
