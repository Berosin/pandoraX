"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { PreviewFrame } from "@/components/preview/PreviewFrame";
import { SourcePanel } from "@/components/artifact/SourcePanel";
import { AssetsPanel } from "@/components/artifact/AssetsPanel";
import { ConfigPanel } from "@/components/artifact/ConfigPanel";
import { ActionBar } from "@/components/artifact/ActionBar";
import { FullscreenPreview } from "@/components/artifact/FullscreenPreview";
import { CopyButton } from "@/components/ui/CopyButton";
import { Maximize2 } from "lucide-react";
import { getDefaultConfigValues } from "@/lib/configuration";
import type {
  ArtifactConfigValues,
  ArtifactDefinition,
} from "@/types/artifact";
import type { LoadedArtifactFile } from "@/lib/artifact-loader";

interface ArtifactWorkspaceProps {
  artifact: ArtifactDefinition;
  source: LoadedArtifactFile[];
  installCommand: string | null;
}

function FullscreenCorner({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Fullscreen"
      className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background/80 text-foreground-dim backdrop-blur transition-colors hover:border-accent hover:text-accent"
    >
      <Maximize2 size={14} />
    </button>
  );
}

export function ArtifactWorkspace({
  artifact,
  source,
  installCommand,
}: ArtifactWorkspaceProps) {
  const [activeTab, setActiveTab] = useState("preview");
  const [values, setValues] = useState<ArtifactConfigValues>(() =>
    artifact.configSchema ? getDefaultConfigValues(artifact.configSchema) : {}
  );
  const [fullscreen, setFullscreen] = useState(false);

  function handleConfigChange(key: string, value: number | string | boolean) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleReset() {
    if (artifact.configSchema) {
      setValues(getDefaultConfigValues(artifact.configSchema));
    }
  }

  async function handleCopySource() {
    const entryFile = source.find((file) => file.path === artifact.entry) ?? source[0];
    if (!entryFile) return false;
    try {
      await navigator.clipboard.writeText(entryFile.content);
      return true;
    } catch {
      return false;
    }
  }

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: artifact.name, text: artifact.description, url });
        return true;
      } catch {
        return false; // person cancelled the share sheet — not a failure
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      return false;
    }
  }

  return (
    <div>
      <ActionBar
        onCopySource={handleCopySource}
        onGetSource={() => setActiveTab("source")}
        onShare={handleShare}
        onFullscreen={() => setFullscreen(true)}
      />

      <div className="mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="customize">Customize</TabsTrigger>
            <TabsTrigger value="source">Source</TabsTrigger>
            {installCommand && (
              <TabsTrigger value="installation">Installation</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="preview">
            <div className="relative flex h-[22rem] items-center justify-center rounded-lg border border-border bg-surface sm:h-[26rem]">
              {activeTab === "preview" && (
                <PreviewFrame artifact={artifact} values={values} />
              )}
              <FullscreenCorner onClick={() => setFullscreen(true)} />
            </div>
          </TabsContent>

          <TabsContent value="customize">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_18rem]">
              <div className="relative flex h-[22rem] items-center justify-center rounded-lg border border-border bg-surface sm:h-[26rem]">
                {activeTab === "customize" && (
                  <PreviewFrame artifact={artifact} values={values} />
                )}
                <FullscreenCorner onClick={() => setFullscreen(true)} />
              </div>
              <ConfigPanel
                schema={artifact.configSchema ?? {}}
                values={values}
                onChange={handleConfigChange}
                onReset={handleReset}
              />
            </div>
          </TabsContent>

          <TabsContent value="source">
            <p className="text-caption text-muted">
              {artifact.files.length} file
              {artifact.files.length === 1 ? "" : "s"} · entry at{" "}
              <code className="font-mono text-foreground-dim">
                {artifact.entry}
              </code>
            </p>
            <div className="mt-4">
              <SourcePanel files={source} />
            </div>

            {artifact.assets && artifact.assets.length > 0 && (
              <div className="mt-8">
                <p className="text-label mb-3 text-muted">Assets</p>
                <AssetsPanel artifact={artifact} assets={artifact.assets} />
              </div>
            )}
          </TabsContent>

          {installCommand && (
            <TabsContent value="installation">
              <div className="flex items-center justify-between">
                <p className="text-caption text-muted">
                  Run this in your project.
                </p>
                <CopyButton value={installCommand} />
              </div>
              <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-surface p-4 text-xs text-foreground-dim">
                <code>{installCommand}</code>
              </pre>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {fullscreen && (
        <FullscreenPreview
          artifact={artifact}
          values={values}
          onClose={() => setFullscreen(false)}
        />
      )}
    </div>
  );
}