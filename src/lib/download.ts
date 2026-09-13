import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";
import type { ArtifactConfigValues, ArtifactMetadata } from "@/types/artifact";
import { ARTIFACTS_ROOT, loadArtifactSource } from "@/lib/artifact-loader";
import { getDefaultConfigValues } from "@/lib/configuration";
import {
  generateCustomizationNote,
  generateCustomizedEntry,
  generateLicense,
  generatePackageJson,
  generateReadme,
} from "@/lib/artifact-package-files";

export interface DownloadResult {
  filename: string;
  buffer: Buffer;
}

const README_NAMES = new Set(["readme.md", "readme"]);
const PACKAGE_NAMES = new Set(["package.json"]);
const LICENSE_NAMES = new Set(["license", "license.md", "license.txt"]);

/** True for a file that sits at the artifact's own root (no "/" in its
 * declared path) and matches one of the well-known meta filenames. */
function matches(filePath: string, names: Set<string>): boolean {
  if (filePath.includes("/")) return false;
  return names.has(filePath.toLowerCase());
}

/**
 * Builds a complete, ready-to-use ZIP for a single artifact:
 *
 *   src/…          — every declared source file, structure preserved
 *   public/…       — every declared asset, structure preserved
 *   README.md      — the artifact's own, or one generated from its metadata
 *   package.json   — the artifact's own, or one generated from its metadata
 *   LICENSE(.md)   — the artifact's own, or one generated from its license
 *
 * Reads exclusively through the artifact registry and the artifact
 * system's own file/asset declarations — there is nothing artifact-
 * specific in this function, so it works unchanged for every artifact
 * the registry contains, present or future.
 *
 * `exportConfigValues` is the third tier of the configuration model:
 * the schema's own `default` values are the *default* configuration;
 * whatever's live in the browser as someone customizes is the
 * *current* configuration; and this parameter — resolved fresh,
 * server-side, from the download request's own query string rather
 * than trusted blindly off the client — is the *export* configuration
 * actually baked into this specific ZIP. When it's absent, or matches
 * the schema's defaults exactly, the export is identical to Phase 8's
 * plain download; only a genuine customization adds anything extra.
 */
export async function buildArtifactZip(
  artifact: ArtifactMetadata,
  exportConfigValues?: ArtifactConfigValues
): Promise<DownloadResult> {
  const files = await loadArtifactSource(artifact);
  const zip = new JSZip();

  const readmeFile = files.find((f) => matches(f.path, README_NAMES));
  const packageFile = files.find((f) => matches(f.path, PACKAGE_NAMES));
  const licenseFile = files.find((f) => matches(f.path, LICENSE_NAMES));
  const rootMetaFiles = new Set([readmeFile, packageFile, licenseFile]);

  for (const file of files) {
    if (rootMetaFiles.has(file)) continue;
    zip.file(`src/${file.path}`, file.content);
  }

  let readmeContent = readmeFile?.content ?? generateReadme(artifact);

  const schema = artifact.configSchema;
  const isCustomized =
    !!schema &&
    !!exportConfigValues &&
    Object.entries(getDefaultConfigValues(schema)).some(
      ([key, defaultValue]) => exportConfigValues[key] !== defaultValue
    );

  if (isCustomized && schema) {
    const { path: customPath, content } = generateCustomizedEntry(
      artifact,
      exportConfigValues!
    );
    zip.file(`src/${customPath}`, content);
    readmeContent += generateCustomizationNote(customPath, exportConfigValues!);
  }

  zip.file("README.md", readmeContent);
  zip.file("package.json", packageFile?.content ?? generatePackageJson(artifact));
  zip.file(licenseFile?.path ?? "LICENSE", licenseFile?.content ?? generateLicense(artifact));

  if (artifact.assets && artifact.assets.length > 0) {
    const assetsRoot = path.join(ARTIFACTS_ROOT, artifact.slug, "assets");

    for (const asset of artifact.assets) {
      const fullPath = path.join(assetsRoot, asset.path);

      // Guard against path traversal even though these paths come from
      // the artifact's own declared config, not user input.
      if (!fullPath.startsWith(assetsRoot + path.sep)) continue;

      try {
        const bytes = await readFile(fullPath);
        zip.file(`public/${asset.path}`, bytes);
      } catch {
        // Declared asset missing on disk — skip it rather than fail
        // the whole archive; the rest of the artifact is still valid.
      }
    }
  }

  const buffer = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  return { filename: `${artifact.slug}.zip`, buffer };
}
