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
 * This is the single choke point the customization panel's presets and
 * the `?key=value` share-URL restore (see config-url.ts) both funnel through.
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

const DEFAULT_GROUP = "Options";

/**
 * Buckets a schema's fields by their declared `group`, preserving the
 * order each group first appears in and the field order within it.
 * Fields without a group land in a shared "Options" bucket. Purely a
 * presentation concern — ConfigPanel uses this to decide whether to
 * render section headers at all (a single-group schema stays flat).
 */
export function groupConfigFields(
  schema: ArtifactConfigSchema
): { group: string; keys: string[] }[] {
  const order: string[] = [];
  const byGroup = new Map<string, string[]>();

  for (const [key, field] of Object.entries(schema)) {
    const group = field.group ?? DEFAULT_GROUP;
    if (!byGroup.has(group)) {
      byGroup.set(group, []);
      order.push(group);
    }
    byGroup.get(group)!.push(key);
  }

  return order.map((group) => ({ group, keys: byGroup.get(group)! }));
}
