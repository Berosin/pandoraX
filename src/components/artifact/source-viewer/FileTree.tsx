"use client";

import { ChevronRight, Folder, FolderOpen } from "lucide-react";
import { cn } from "@/lib/cn";
import { FileTypeIcon } from "./file-icons";
import type { FileTreeNode } from "./types";

interface FileTreeProps {
  nodes: FileTreeNode[];
  depth?: number;
  selectedPath: string;
  expanded: Set<string>;
  onSelect: (path: string) => void;
  onToggle: (path: string) => void;
}

export function FileTree({
  nodes,
  depth = 0,
  selectedPath,
  expanded,
  onSelect,
  onToggle,
}: FileTreeProps) {
  return (
    <div role="tree" className="py-1.5">
      {nodes.map((node) => {
        const indent = 10 + depth * 14;

        if (node.type === "folder") {
          const isOpen = expanded.has(node.path);
          return (
            <div key={node.path} role="treeitem" aria-expanded={isOpen} aria-selected={false}>
              <button
                type="button"
                onClick={() => onToggle(node.path)}
                style={{ paddingLeft: indent }}
                className="flex w-full items-center gap-1.5 py-1 pr-3 text-left text-xs text-foreground-dim transition-colors hover:text-foreground"
              >
                <ChevronRight
                  size={12}
                  strokeWidth={2}
                  className={cn("shrink-0 text-muted transition-transform", isOpen && "rotate-90")}
                />
                {isOpen ? (
                  <FolderOpen size={14} strokeWidth={1.75} className="shrink-0 text-muted" />
                ) : (
                  <Folder size={14} strokeWidth={1.75} className="shrink-0 text-muted" />
                )}
                <span className="truncate">{node.name}</span>
              </button>
              {isOpen && (
                <FileTree
                  nodes={node.children}
                  depth={depth + 1}
                  selectedPath={selectedPath}
                  expanded={expanded}
                  onSelect={onSelect}
                  onToggle={onToggle}
                />
              )}
            </div>
          );
        }

        const isSelected = node.path === selectedPath;
        return (
          <button
            key={node.path}
            type="button"
            role="treeitem"
            aria-selected={isSelected}
            onClick={() => onSelect(node.path)}
            style={{ paddingLeft: indent + 16 }}
            className={cn(
              "flex w-full items-center gap-1.5 py-1 pr-3 text-left text-xs transition-colors",
              isSelected
                ? "bg-accent-muted text-foreground"
                : "text-foreground-dim hover:text-foreground"
            )}
          >
            <FileTypeIcon language={node.file.language} size={13} />
            <span className="truncate">{node.name}</span>
            {node.file.isEntry && (
              <span className="ml-auto shrink-0 rounded-sm border border-border-strong px-1 py-px text-[9px] uppercase tracking-wide text-muted">
                entry
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
