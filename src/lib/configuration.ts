import type {
  ArtifactConfigSchema,
  ArtifactConfigValues,
} from "@/types/artifact";

/** Resolves an artifact's config schema down to its default values. */
export function getDefaultConfigValues(
  schema: ArtifactConfigSchema
): ArtifactConfigValues {
  return Object.fromEntries(
    Object.entries(schema).map(([key, field]) => [key, field.default])
  );
}

/**
 * Merges user overrides on top of an artifact's defaults, dropping any
 * key that isn't part of the schema and any value of the wrong type.
 * This is the single choke point the future customization panel and
 * the `?key=value` share-URL restore (§19) will both funnel through.
 */
export function resolveConfigValues(
  schema: ArtifactConfigSchema,
  overrides: Partial<ArtifactConfigValues> = {}
): ArtifactConfigValues {
  const defaults = getDefaultConfigValues(schema);

  for (const [key, value] of Object.entries(overrides)) {
    const field = schema[key];
    if (!field || value === undefined) continue;
    if (typeof value !== typeof field.default) continue;
    defaults[key] = value;
  }

  return defaults;
}
