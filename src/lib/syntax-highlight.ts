import "server-only";
import {
  createHighlighter,
  createCssVariablesTheme,
  createJavaScriptRegexEngine,
  type Highlighter,
} from "shiki";
import type { CodeLanguage } from "@/types/artifact";

/**
 * A single highlighted token, stripped down to what the code viewer
 * actually renders. `color` is always a `var(--shiki-*)` reference (see
 * the "css-variables" theme below) so the viewer never bakes literal
 * hex colors into the DOM — it stays in sync with the light/dark theme
 * for free.
 */
export interface CodeToken {
  content: string;
  color: string;
  bold?: boolean;
  italic?: boolean;
}

/** One highlighted file, as lines of tokens plus the raw text per line
 * (used for search matching, which operates on real characters rather
 * than token boundaries). */
export type HighlightedLine = {
  tokens: CodeToken[];
  text: string;
};

const SHIKI_LANGS = [
  "typescript",
  "tsx",
  "javascript",
  "jsx",
  "css",
  "glsl",
  "json",
  "html",
  "markdown",
] as const;

/** Maps PandoraX's artifact-file language tag to a Shiki grammar id.
 * "txt" has no grammar — it's rendered as plain, unhighlighted text. */
const LANGUAGE_MAP: Record<CodeLanguage, (typeof SHIKI_LANGS)[number] | "text"> = {
  ts: "typescript",
  tsx: "tsx",
  js: "javascript",
  jsx: "jsx",
  css: "css",
  glsl: "glsl",
  json: "json",
  html: "html",
  md: "markdown",
  txt: "text",
};

const THEME_NAME = "px-css-variables";

let highlighterPromise: Promise<Highlighter> | null = null;

/** One highlighter instance shared across every request in this process.
 * Uses Shiki's JS regex engine (no WASM) so it drops straight into the
 * Next.js server runtime with no extra bundling config. */
function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    const theme = createCssVariablesTheme({
      name: THEME_NAME,
      variablePrefix: "--shiki-",
      variableDefaults: {},
      fontStyle: true,
    });
    highlighterPromise = createHighlighter({
      themes: [theme],
      langs: [...SHIKI_LANGS],
      engine: createJavaScriptRegexEngine(),
    });
  }
  return highlighterPromise;
}

/**
 * Tokenizes a file's source for the code viewer. Returns one entry per
 * line so the viewer can render line numbers, per-line search matches
 * and folding without re-parsing anything on the client.
 */
export async function highlightSource(
  content: string,
  language: CodeLanguage
): Promise<HighlightedLine[]> {
  const lines = content.split("\n");
  const shikiLang = LANGUAGE_MAP[language];

  if (shikiLang === "text") {
    return lines.map((text) => ({
      text,
      tokens: [{ content: text, color: "var(--shiki-foreground)" }],
    }));
  }

  const highlighter = await getHighlighter();
  const { tokens } = highlighter.codeToTokens(content, {
    lang: shikiLang,
    theme: THEME_NAME,
  });

  return lines.map((text, i) => {
    const lineTokens = tokens[i] ?? [];
    return {
      text,
      tokens: lineTokens.length
        ? lineTokens.map((token) => ({
            content: token.content,
            color: token.color ?? "var(--shiki-foreground)",
            bold: ((token.fontStyle ?? 0) & 2) !== 0,
            italic: ((token.fontStyle ?? 0) & 1) !== 0,
          }))
        : text
          ? [{ content: text, color: "var(--shiki-foreground)" }]
          : [],
    };
  });
}
