import type { LoadedArtifactFile } from "@/lib/artifact-loader";
import type { FileTreeFolderNode, FileTreeNode } from "./types";

/**
 * Builds a nested folder/file tree from an artifact's flat file list.
 * Works for any structure the artifact system hands it — arbitrarily
 * deep nesting, any number of files per folder — nothing here is
 * specific to a particular artifact.
 */
export function buildFileTree(files: LoadedArtifactFile[]): FileTreeNode[] {
  const root: FileTreeFolderNode = { type: "folder", path: "", name: "", children: [] };

  for (const file of files) {
    const segments = file.path.split("/").filter(Boolean);
    let cursor = root;

    for (let i = 0; i < segments.length - 1; i++) {
      const segment = segments[i];
      const folderPath = segments.slice(0, i + 1).join("/");
      let next = cursor.children.find(
        (node): node is FileTreeFolderNode =>
          node.type === "folder" && node.name === segment
      );
      if (!next) {
        next = { type: "folder", path: folderPath, name: segment, children: [] };
        cursor.children.push(next);
      }
      cursor = next;
    }

    const name = segments[segments.length - 1] ?? file.path;
    cursor.children.push({ type: "file", path: file.path, name, file });
  }

  sortTree(root.children);
  return root.children;
}

/** Folders before files, both alphabetical — the standard IDE convention. */
function sortTree(nodes: FileTreeNode[]) {
  nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  for (const node of nodes) {
    if (node.type === "folder") sortTree(node.children);
  }
}

/** Every folder path in the tree — used to default to "fully expanded"
 * for the modest file counts artifacts actually ship with. */
export function collectFolderPaths(nodes: FileTreeNode[]): string[] {
  const paths: string[] = [];
  for (const node of nodes) {
    if (node.type === "folder") {
      paths.push(node.path);
      paths.push(...collectFolderPaths(node.children));
    }
  }
  return paths;
}
