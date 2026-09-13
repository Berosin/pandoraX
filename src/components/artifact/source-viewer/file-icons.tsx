import {
  FileCode2,
  FileJson2,
  FileText,
  Braces,
  Palette,
  CodeXml,
  Sparkles,
  File as FileIcon,
} from "lucide-react";
import type { CodeLanguage } from "@/types/artifact";

const ICONS: Record<CodeLanguage, typeof FileIcon> = {
  tsx: CodeXml,
  ts: FileCode2,
  jsx: CodeXml,
  js: FileCode2,
  css: Palette,
  glsl: Sparkles,
  json: FileJson2,
  html: Braces,
  md: FileText,
  txt: FileIcon,
};

const COLORS: Record<CodeLanguage, string> = {
  tsx: "text-accent",
  ts: "text-accent",
  jsx: "text-accent",
  js: "text-accent",
  css: "text-muted",
  glsl: "text-accent",
  json: "text-muted",
  html: "text-muted",
  md: "text-muted",
  txt: "text-muted",
};

export function FileTypeIcon({
  language,
  size = 14,
}: {
  language: CodeLanguage;
  size?: number;
}) {
  const Icon = ICONS[language] ?? FileIcon;
  return <Icon size={size} className={COLORS[language]} strokeWidth={1.75} />;
}
