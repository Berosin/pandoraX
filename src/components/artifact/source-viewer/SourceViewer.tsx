"use client";

import { useMemo, useState } from "react";
import { Copy, Check, Files, Search, Download, Loader2, AlertTriangle } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/cn";
import type { LoadedArtifactFile } from "@/lib/artifact-loader";
import { buildFileTree, collectFolderPaths } from "./build-file-tree";
import { FileTree } from "./FileTree";
import { FileTypeIcon } from "./file-icons";
import { CodeView } from "./CodeView";
import { SourceSearch } from "./SourceSearch";
import { useSourceSearch } from "./use-source-search";
import { EmptyState } from "@/components/ui/EmptyState";
import { useArtifactDownload, DOWNLOAD_STATE_LABEL } from "@/lib/use-artifact-download";

interface SourceViewerProps {
  files: LoadedArtifactFile[];
  /** The artifact's declared entry path — selected by default so people
   * land on the file that actually matters first. */
  entry: string;
  /** Artifact slug, used only to target the generic download route —
   * this component has no artifact-specific download logic of its own. */
  slug: string;
}

function ToolbarButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Tooltip content={label}>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-raised hover:text-foreground"
      >
        {icon}
      </button>
    </Tooltip>
  );
}

export function SourceViewer({ files, entry, slug }: SourceViewerProps) {
  const download = useArtifactDownload(slug);
  const tree = useMemo(() => buildFileTree(files), [files]);
  const allFolderPaths = useMemo(() => collectFolderPaths(tree), [tree]);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(allFolderPaths));

  const defaultPath = files.find((f) => f.path === entry)?.path ?? files[0]?.path ?? "";
  const [selectedPath, setSelectedPath] = useState(defaultPath);
  const selectedFile = files.find((f) => f.path === selectedPath);

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const search = useSourceSearch(selectedFile?.lines ?? [], searchOpen ? query : "");

  const [copiedFile, setCopiedFile] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  function toggleFolder(path: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }

  function selectFile(path: string) {
    setSelectedPath(path);
    setQuery("");
  }

  async function copyFile() {
    if (!selectedFile) return;
    try {
      await navigator.clipboard.writeText(selectedFile.content);
      setCopiedFile(true);
      setTimeout(() => setCopiedFile(false), 1500);
    } catch {
      // Clipboard API unavailable — nothing to recover, fail quietly.
    }
  }

  async function copyAll() {
    const separator = `\n\n${"─".repeat(48)}\n\n`;
    const bundle = files
      .map((file) => `// ${file.path}\n\n${file.content}`)
      .join(separator);
    try {
      await navigator.clipboard.writeText(bundle);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1500);
    } catch {
      // Clipboard API unavailable — nothing to recover, fail quietly.
    }
  }

  if (files.length === 0 || !selectedFile) {
    return (
      <EmptyState
        bordered
        title="No source files registered"
        description="This artifact hasn't declared any files in its config yet."
      />
    );
  }

  return (
    <div className="flex h-[30rem] flex-col overflow-hidden rounded-lg border border-border sm:h-[34rem] md:flex-row">
      {/* File tree */}
      <div className="flex h-40 shrink-0 flex-col border-b border-border bg-surface-raised md:h-auto md:w-56 md:border-b-0 md:border-r">
        <div className="flex shrink-0 items-center gap-1.5 border-b border-border px-3 py-2">
          <Files size={12} className="text-muted" />
          <span className="text-label text-muted">
            {files.length} file{files.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <FileTree
            nodes={tree}
            selectedPath={selectedPath}
            expanded={expanded}
            onSelect={selectFile}
            onToggle={toggleFolder}
          />
        </div>
      </div>

      {/* Code panel */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-surface-raised px-3 py-1.5">
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            <FileTypeIcon language={selectedFile.language} />
            <span className="truncate font-mono text-xs text-foreground-dim">
              {selectedFile.path}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {searchOpen ? (
              <SourceSearch
                query={query}
                onQueryChange={setQuery}
                matchCount={search.matches.length}
                activeIndex={search.activeIndex}
                onNext={search.goToNext}
                onPrevious={search.goToPrevious}
                onClose={() => {
                  setSearchOpen(false);
                  setQuery("");
                }}
              />
            ) : (
              <ToolbarButton
                icon={<Search size={14} />}
                label="Search this file"
                onClick={() => setSearchOpen(true)}
              />
            )}
            <ToolbarButton
              icon={copiedFile ? <Check size={14} /> : <Copy size={14} />}
              label={copiedFile ? "Copied file" : "Copy file"}
              onClick={copyFile}
            />
            <ToolbarButton
              icon={copiedAll ? <Check size={14} /> : <Files size={14} />}
              label={copiedAll ? "Copied all" : "Copy all source"}
              onClick={copyAll}
            />
            <span aria-hidden className="mx-0.5 h-4 w-px bg-border" />
            <ToolbarButton
              icon={
                download.state === "preparing" || download.state === "archiving" ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : download.state === "ready" ? (
                  <Check size={14} />
                ) : download.state === "error" ? (
                  <AlertTriangle size={14} />
                ) : (
                  <Download size={14} />
                )
              }
              label={
                download.state === "error" && download.error
                  ? download.error
                  : download.state === "idle"
                    ? "Download ZIP"
                    : DOWNLOAD_STATE_LABEL[download.state]
              }
              onClick={download.download}
            />
          </div>
        </div>

        <div className={cn("min-h-0 flex-1", "relative")}>
          <CodeView
            file={selectedFile}
            matches={search.matches}
            activeIndex={search.activeIndex}
          />
        </div>
      </div>
    </div>
  );
}
