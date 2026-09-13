import type { LoadedArtifactFile } from "@/lib/artifact-loader";

export interface FileTreeFileNode {
  type: "file";
  /** Full path relative to the artifact folder, e.g. "shaders/vertex.glsl". */
  path: string;
  /** Just the last segment, e.g. "vertex.glsl". */
  name: string;
  file: LoadedArtifactFile;
}

export interface FileTreeFolderNode {
  type: "folder";
  /** Full path relative to the artifact folder, e.g. "shaders". */
  path: string;
  name: string;
  children: FileTreeNode[];
}

export type FileTreeNode = FileTreeFileNode | FileTreeFolderNode;
