"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { PreviewFrame } from "@/components/preview/PreviewFrame";
import { SourcePanel } from "@/components/artifact/SourcePanel";
import { AssetsPanel } from "@/components/artifact/AssetsPanel";
import { ConfigPanel } from "@/components/artifact/ConfigPanel";
import { ActionBar } from "@/components/artifact/ActionBar";
import { FullscreenPreview } from "@/components/artifact/FullscreenPreview";
import { CopyButton } from "@/components/ui/CopyButton";
import { Maximize2 } from "lucide-react";
import { getDefaultConfigValues, resolveConfigValues } from "@/lib/configuration";
import { encodeConfigToParams } from "@/lib/config-url";
import { useArtifactDownload } from "@/lib/use-artifact-download";
import type {
  ArtifactConfigValues,
  ArtifactDefinition,
} from "@/types/artifact";
import type { LoadedArtifactFile } from "@/lib/artifact-loader";

interface ArtifactWorkspaceProps {
  artifact: ArtifactDefinition;
  source: LoadedArtifactFile[];
  installCommand: string | null;
  /** The artifact's current configuration as resolved server-side from
   * the request's URL (e.g. from a shared `?speed=1.2&color=8B5CF6`
   * link) — falls back to the schema's own defaults when absent. This
   * is the "current configuration" the whole workspace (preview,
   * customize panel, and — via the URL it keeps in sync — the
   * download route) is seeded from; it's distinct from the schema's
   * hard-coded "default configuration" and from whatever gets resolved
   * again, server-side, into an "export configuration" at download time. */
  initialConfigValues?: ArtifactConfigValues;
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
  initialConfigValues,
}: ArtifactWorkspaceProps) {
  const [activeTab, setActiveTab] = useState("preview");
  const [values, setValues] = useState<ArtifactConfigValues>(
    () =>
      initialConfigValues ??
      (artifact.configSchema ? getDefaultConfigValues(artifact.configSchema) : {})
  );
  const [fullscreen, setFullscreen] = useState(false);
  const download = useArtifactDownload(artifact.slug);

  // Keeps the address bar's query string mirroring `values` at all
  // times — the single source of truth "Share Configuration" copies
  // from and the download route reads its export configuration from.
  // A plain history update, not a router navigation: it shouldn't
  // trigger a re-fetch or add a back-button entry per keystroke.
  useEffect(() => {
    if (!artifact.configSchema) return;
    const query = encodeConfigToParams(artifact.configSchema, values).toString();
    const url = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, [artifact.configSchema, values]);

  function handleConfigChange(key: string, value: number | string | boolean) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleReset() {
    if (artifact.configSchema) {
      setValues(getDefaultConfigValues(artifact.configSchema));
    }
  }

  function handleApplyPreset(preset: Partial<ArtifactConfigValues>) {
    if (artifact.configSchema) {
      setValues(resolveConfigValues(artifact.configSchema, preset));
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
        onGetSource={download.download}
        downloadState={download.state}
        downloadError={download.error}
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
                presets={artifact.configPresets}
                onApplyPreset={handleApplyPreset}
              />
            </div>
          </TabsContent>

          <TabsContent value="source">
            <SourcePanel files={source} entry={artifact.entry} slug={artifact.slug} />

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