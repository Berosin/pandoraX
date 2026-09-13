import { artifacts } from "@/artifacts";
import type { ArtifactCategory, ArtifactDefinition } from "@/types/artifact";

export function getAllArtifacts(): ArtifactDefinition[] {
  return artifacts;
}

export function getArtifactBySlug(slug: string): ArtifactDefinition | undefined {
  return artifacts.find((artifact) => artifact.slug === slug);
}

export function getArtifactsByCategory(
  category: ArtifactCategory
): ArtifactDefinition[] {
  return artifacts.filter((artifact) => artifact.category === category);
}

export function getFeaturedArtifacts(): ArtifactDefinition[] {
  return artifacts.filter((artifact) => artifact.featured);
}

/** Every category currently in use, in registry order — powers filter UI
 * without hardcoding a list that can drift from the actual data. */
export function getUsedCategories(): ArtifactCategory[] {
  return Array.from(new Set(artifacts.map((artifact) => artifact.category)));
}

export function getRandomArtifact(
  excludeSlug?: string
): ArtifactDefinition | undefined {
  const pool = excludeSlug
    ? artifacts.filter((artifact) => artifact.slug !== excludeSlug)
    : artifacts;
  if (pool.length === 0) return undefined;
  return pool[Math.floor(Math.random() * pool.length)];
}
