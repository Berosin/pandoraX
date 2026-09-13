"use client";

import { useState } from "react";
import { ConfigControl } from "./ConfigControl";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { SlidersHorizontal, Copy, Check, Share2 } from "lucide-react";
import { groupConfigFields } from "@/lib/configuration";
import type {
  ArtifactConfigPreset,
  ArtifactConfigSchema,
  ArtifactConfigValues,
} from "@/types/artifact";

interface ConfigPanelProps {
  schema: ArtifactConfigSchema;
  values: ArtifactConfigValues;
  onChange: (key: string, value: number | string | boolean) => void;
  onReset: () => void;
  presets?: ArtifactConfigPreset[];
  onApplyPreset?: (values: Partial<ArtifactConfigValues>) => void;
}

function PanelActionButton({
  icon,
  label,
  activeLabel,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  activeLabel: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md border border-border-strong px-2.5 py-1.5 text-xs font-medium text-foreground-dim transition-colors hover:border-accent hover:text-accent"
    >
      {active ? <Check size={13} /> : icon}
      {active ? activeLabel : label}
    </button>
  );
}

export function ConfigPanel({
  schema,
  values,
  onChange,
  onReset,
  presets,
  onApplyPreset,
}: ConfigPanelProps) {
  const entries = Object.entries(schema);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  if (entries.length === 0) {
    return (
      <EmptyState
        bordered
        icon={<SlidersHorizontal size={20} />}
        title="Nothing to customize yet"
        description="This artifact doesn't expose any configuration options."
      />
    );
  }

  const isDefault = entries.every(
    ([key, field]) => values[key] === field.default
  );
  const groups = groupConfigFields(schema);
  const showGroupHeaders = groups.length > 1;

  async function copyConfiguration() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(values, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — nothing to recover, fail quietly.
    }
  }

  async function shareConfiguration() {
    // The address bar's query string is kept in sync with `values` by
    // ArtifactWorkspace on every change, so the current URL already
    // *is* the shareable link — this just hands it to the clipboard.
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 1500);
    } catch {
      // Clipboard API unavailable — nothing to recover, fail quietly.
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-label text-muted">Options</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          disabled={isDefault}
          className="px-0"
        >
          Reset to defaults
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <PanelActionButton
          icon={<Copy size={13} />}
          label="Copy configuration"
          activeLabel="Copied"
          active={copied}
          onClick={copyConfiguration}
        />
        <PanelActionButton
          icon={<Share2 size={13} />}
          label="Share configuration"
          activeLabel="Link copied"
          active={shared}
          onClick={shareConfiguration}
        />
      </div>

      {presets && presets.length > 0 && onApplyPreset && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted">Presets</p>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => onApplyPreset(preset.values)}
                title={preset.description}
                className="rounded-full border border-border-strong px-3 py-1 text-xs text-foreground-dim transition-colors hover:border-accent hover:text-accent"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {groups.map(({ group, keys }) => (
          <div key={group} className="flex flex-col gap-5">
            {showGroupHeaders && (
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                {group}
              </p>
            )}
            <div className="flex flex-col gap-5">
              {keys.map((key) => (
                <ConfigControl
                  key={key}
                  configKey={key}
                  field={schema[key]}
                  value={values[key] ?? schema[key].default}
                  onChange={(value) => onChange(key, value)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
