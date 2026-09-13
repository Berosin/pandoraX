import type { ArtifactConfigSchema, ArtifactConfigValues } from "@/types/artifact";

const HEX_COLOR = /^#[0-9a-f]{6}$/i;
/** Defensive cap — nothing in the schema needs a value longer than
 * this; guards against someone hand-crafting a pathological URL. */
const MAX_TEXT_LENGTH = 500;

/**
 * Encodes only the values that differ from their schema default into a
 * query string — e.g. `?speed=1.2&color=8B5CF6`. Values already at
 * their default are omitted, which is what keeps a share link for an
 * un-customized artifact clean (no params at all).
 *
 * Colors are encoded without their leading "#" (URL fragment
 * delimiter) and upper-cased, matching the example in the spec.
 */
export function encodeConfigToParams(
  schema: ArtifactConfigSchema,
  values: ArtifactConfigValues
): URLSearchParams {
  const params = new URLSearchParams();

  for (const [key, field] of Object.entries(schema)) {
    const value = values[key];
    if (value === undefined || value === field.default) continue;

    if (field.type === "color" && typeof value === "string") {
      params.set(key, value.replace(/^#/, "").toUpperCase());
    } else {
      params.set(key, String(value));
    }
  }

  return params;
}

/**
 * The inverse of encodeConfigToParams — reads whatever of a schema's
 * keys are present in `params`, parses and validates each against its
 * field definition (range-clamping numbers, checking select options,
 * validating hex colors), and drops anything malformed or unknown
 * rather than throwing. The result is a plain Partial<ArtifactConfigValues>
 * meant to be passed straight into resolveConfigValues, which fills in
 * defaults for everything not present here.
 */
export function decodeConfigFromParams(
  schema: ArtifactConfigSchema,
  params: URLSearchParams
): Partial<ArtifactConfigValues> {
  const values: Partial<ArtifactConfigValues> = {};

  for (const [key, field] of Object.entries(schema)) {
    const raw = params.get(key);
    if (raw === null) continue;

    switch (field.type) {
      case "number": {
        const parsed = Number(raw);
        if (Number.isNaN(parsed)) continue;
        values[key] = Math.min(field.max, Math.max(field.min, parsed));
        break;
      }
      case "boolean": {
        if (raw === "true") values[key] = true;
        else if (raw === "false") values[key] = false;
        break;
      }
      case "color": {
        const withHash = raw.startsWith("#") ? raw : `#${raw}`;
        if (HEX_COLOR.test(withHash)) values[key] = withHash.toLowerCase();
        break;
      }
      case "select": {
        if (field.options.includes(raw)) values[key] = raw;
        break;
      }
      case "text": {
        values[key] = raw.slice(0, MAX_TEXT_LENGTH);
        break;
      }
    }
  }

  return values;
}
