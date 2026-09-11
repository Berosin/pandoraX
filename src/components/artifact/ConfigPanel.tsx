"use client";

import { ConfigControl } from "./ConfigControl";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { SlidersHorizontal } from "lucide-react";
import type { ArtifactConfigSchema, ArtifactConfigValues } from "@/types/artifact";

interface ConfigPanelProps {
  schema: ArtifactConfigSchema;
  values: ArtifactConfigValues;
  onChange: (key: string, value: number | string | boolean) => void;
  onReset: () => void;
}

export function ConfigPanel({ schema, values, onChange, onReset }: ConfigPanelProps) {
  const entries = Object.entries(schema);

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

      <div className="flex flex-col gap-6">
        {entries.map(([key, field]) => (
          <ConfigControl
            key={key}
            configKey={key}
            field={field}
            value={values[key] ?? field.default}
            onChange={(value) => onChange(key, value)}
          />
        ))}
      </div>
    </div>
  );
}