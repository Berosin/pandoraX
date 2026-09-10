import type { LoadedArtifactFile } from "@/lib/artifact-loader";

export function SourcePanel({ files }: { files: LoadedArtifactFile[] }) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
      {files.map((file) => (
        <div key={file.path}>
          <div className="flex items-center justify-between bg-surface-raised px-4 py-2">
            <span className="font-mono text-xs text-cream-dim">{file.path}</span>
            <span className="text-xs text-muted">{file.language}</span>
          </div>
          <pre className="overflow-x-auto bg-surface p-4 text-xs leading-relaxed text-cream-dim">
            <code>{file.content}</code>
          </pre>
        </div>
      ))}
    </div>
  );
}
