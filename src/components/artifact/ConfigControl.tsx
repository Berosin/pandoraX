"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import type { ArtifactConfigField } from "@/types/artifact";

interface ConfigControlProps {
  configKey: string;
  field: ArtifactConfigField;
  value: number | string | boolean;
  onChange: (value: number | string | boolean) => void;
}

export function ConfigControl({ configKey, field, value, onChange }: ConfigControlProps) {
  const label = field.label ?? configKey;
  const controlId = `config-${configKey}`;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={controlId} className="text-sm text-foreground-dim">
          {label}
        </label>
        {field.type === "number" && (
          <span className="font-mono text-xs text-muted">{String(value)}</span>
        )}
        {field.type === "color" && (
          <span className="font-mono text-xs text-muted">{String(value)}</span>
        )}
      </div>

      {field.type === "number" && (
        <input
          id={controlId}
          type="range"
          min={field.min}
          max={field.max}
          step={field.step}
          value={Number(value)}
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-raised accent-accent"
        />
      )}

      {field.type === "color" && (
        <input
          id={controlId}
          type="color"
          value={String(value)}
          onChange={(event) => onChange(event.target.value)}
          className="h-9 w-full cursor-pointer rounded-md border border-border-strong bg-surface p-1"
        />
      )}

      {field.type === "boolean" && (
        <Switch
          checked={Boolean(value)}
          onCheckedChange={onChange}
          label={label}
        />
      )}

      {field.type === "select" && (
        <Select
          id={controlId}
          value={String(value)}
          onChange={(event) => onChange(event.target.value)}
          className="w-full"
        >
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      )}

      {field.type === "text" && (
        <Input
          id={controlId}
          type="text"
          value={String(value)}
          onChange={(event) => onChange(event.target.value)}
        />
      )}

      {field.description && (
        <p className="text-xs text-muted">{field.description}</p>
      )}
    </div>
  );
}