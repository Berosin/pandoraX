import type { ArtifactConfigValues, ArtifactMetadata } from "@/types/artifact";

/**
 * Every one of these is derived entirely from real fields already on
 * `ArtifactMetadata` (the same fields the metadata panel and
 * installation tab already render) — nothing here is invented per
 * artifact. Used only when an artifact hasn't authored its own root
 * README/package.json/LICENSE among its declared files.
 */

export function generateReadme(artifact: ArtifactMetadata): string {
  const installLine = artifact.dependencies.length
    ? `\`\`\`bash\nnpm install ${artifact.dependencies.join(" ")}\n\`\`\``
    : "No additional dependencies beyond React.";

  const performanceLine = artifact.performance.notes
    ? `${artifact.performance.impact} — ${artifact.performance.notes}`
    : artifact.performance.impact;

  const browserLines = artifact.browserRequirements.length
    ? artifact.browserRequirements.map((req) => `- ${req}`).join("\n")
    : "- No special browser requirements.";

  return `# ${artifact.name}

${artifact.description}

## Details

- **Category:** ${artifact.category}
- **Difficulty:** ${artifact.difficulty}
- **Technologies:** ${artifact.technologies.join(", ")}
- **Entry file:** \`src/${artifact.entry}\`
- **License:** ${artifact.license}
- **Author:** ${artifact.author}
- **Version:** ${artifact.version}

## Installation

${installLine}

## Usage

Copy the \`src/\` folder into your project and import the component from
\`src/${artifact.entry}\`. ${
    artifact.assets && artifact.assets.length > 0
      ? "This artifact ships with static assets under `public/` — keep them alongside the component or update the asset paths to match where you serve them from."
      : "This artifact has no external assets to wire up."
  }

${
  artifact.configurable
    ? "This artifact accepts configuration props — see the component source for the full set of options."
    : ""
}

## Performance

${performanceLine}

## Browser requirements

${browserLines}

---

Generated from PandoraX — an artifact's own README, if it declares one, always takes precedence over this file.
`;
}

export function generatePackageJson(artifact: ArtifactMetadata): string {
  const pkg = {
    name: artifact.slug,
    version: artifact.version,
    private: true,
    description: artifact.description,
    license: artifact.license,
    author: artifact.author,
    dependencies: Object.fromEntries(
      artifact.dependencies.map((dependency) => [dependency, "latest"])
    ),
  };
  return JSON.stringify(pkg, null, 2) + "\n";
}

type LicenseTemplate = (author: string, year: number) => string;

const LICENSE_TEMPLATES: Record<string, LicenseTemplate> = {
  MIT: (author, year) => `MIT License

Copyright (c) ${year} ${author}

Permission is hereby granted, free of charge, to any person obtaining a
copy of this artifact's source and associated files, to deal in the
source without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the source.

THE SOURCE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
`,
};

/** Normalizes common spellings ("mit", "MIT License") to the template key. */
function normalizeLicenseId(license: string): string {
  const trimmed = license.trim().toUpperCase();
  if (trimmed === "MIT" || trimmed === "MIT LICENSE") return "MIT";
  return license.trim();
}

export function generateLicense(artifact: ArtifactMetadata): string {
  const year = new Date().getFullYear();
  const template = LICENSE_TEMPLATES[normalizeLicenseId(artifact.license)];
  if (template) return template(artifact.author, year);

  // No known template for this license identifier — say so honestly
  // rather than fabricating legal text we can't vouch for.
  return `${artifact.license}

Copyright (c) ${year} ${artifact.author}

This artifact is distributed under the ${artifact.license} license.
Refer to the official license text for the full terms.
`;
}

/** Splits "shaders/index.tsx" into its directory prefix ("shaders/")
 * and extension-less base name ("index"). */
function splitEntryPath(entry: string): { dir: string; base: string } {
  const slash = entry.lastIndexOf("/");
  const dir = slash === -1 ? "" : entry.slice(0, slash + 1);
  const fileName = slash === -1 ? entry : entry.slice(slash + 1);
  const base = fileName.replace(/\.[^.]+$/, "");
  return { dir, base };
}

/**
 * Generates a small wrapper file that sits alongside an artifact's real
 * entry file and pre-applies the config values captured at export time
 * as its defaults — e.g. `index.customized.tsx` next to `index.tsx`.
 *
 * This is what "the customization persists into the exported source"
 * actually means here: rather than rewriting the original component's
 * source (fragile, and risks producing invalid code for a shape we
 * didn't anticipate), the original file ships untouched and this file
 * composes with it — `<Component {...config} {...props} />` — which
 * works for literally any artifact component, since every one of them
 * already accepts `Partial<ArtifactConfigValues>` as props.
 */
export function generateCustomizedEntry(
  artifact: ArtifactMetadata,
  exportConfigValues: ArtifactConfigValues
): { path: string; content: string } {
  const { dir, base } = splitEntryPath(artifact.entry);
  const entryFile = artifact.files.find((f) => f.path === artifact.entry);
  const isTypeScript = entryFile?.language === "tsx" || entryFile?.language === "ts";
  const ext = isTypeScript ? "tsx" : "jsx";
  const importPath = `./${base}`;
  const configLiteral = JSON.stringify(exportConfigValues, null, 2);

  const content = isTypeScript
    ? `import Component from "${importPath}";
import type { ComponentProps } from "react";

/**
 * The configuration applied in PandoraX's Customize panel at the time
 * this artifact was exported. Import this file instead of
 * "${importPath}" to get these values pre-applied as defaults — or
 * import \`config\` and spread it yourself.
 */
export const config = ${configLiteral} as const;

export default function Customized(props: ComponentProps<typeof Component>) {
  return <Component {...config} {...props} />;
}
`
    : `import Component from "${importPath}";

/**
 * The configuration applied in PandoraX's Customize panel at the time
 * this artifact was exported. Import this file instead of
 * "${importPath}" to get these values pre-applied as defaults — or
 * import \`config\` and spread it yourself.
 */
export const config = ${configLiteral};

export default function Customized(props) {
  return <Component {...config} {...props} />;
}
`;

  return { path: `${dir}${base}.customized.${ext}`, content };
}

/** Appended to whichever README ends up in a customized export (the
 * artifact's own, or the generated one) so the extra file doesn't go
 * unexplained. */
export function generateCustomizationNote(
  customizedEntryPath: string,
  exportConfigValues: ArtifactConfigValues
): string {
  const rows = Object.entries(exportConfigValues)
    .map(([key, value]) => `- **${key}:** \`${JSON.stringify(value)}\``)
    .join("\n");
  const importPath = `./${customizedEntryPath.replace(/\.[^.]+$/, "")}`;

  return `

## Customization

This export was generated with the following configuration applied in
PandoraX's Customize panel:

${rows}

The original entry file is unchanged. Import \`src/${customizedEntryPath}\`
instead to get these values pre-applied as defaults:

\`\`\`tsx
import Component from "${importPath}";
\`\`\`
`;
}
