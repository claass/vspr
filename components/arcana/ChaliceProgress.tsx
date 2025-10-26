"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChaliceProgressProps {
  value?: number;
  max?: number;
  indeterminate?: boolean;
  label?: string;
  description?: string;
}

export function ChaliceProgress({
  value = 0,
  max = 100,
  indeterminate = false,
  label,
  description,
}: ChaliceProgressProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const id = React.useId();
  const labelId = label ? `${id}-label` : undefined;
  const descriptionId = description ? `${id}-description` : undefined;
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={indeterminate ? undefined : value}
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
      className="relative flex w-full max-w-md flex-col gap-xs rounded-surface-xl border border-[color:var(--color-stroke)] bg-arcana-surface-2 p-sm shadow-arcana-glass-s3"
    >
      <div className="flex items-center justify-between text-sm text-arcana-text-low">
        <span id={labelId} className="font-medium text-arcana-text-high">
          {label}
        </span>
        {!indeterminate && (
          <span className="font-mono text-xs text-arcana-text-low">{Math.round(percent)}%</span>
        )}
      </div>
      <div className="relative h-4 overflow-hidden rounded-arcana-pill bg-[rgba(17,25,38,0.6)]">
        <div
          className={cn(
            "h-full rounded-arcana-pill bg-gradient-to-r from-[rgba(122,108,255,0.9)] via-[rgba(75,217,255,0.9)] to-[rgba(63,245,195,0.9)]",
            indeterminate && "animate-[arcana-breathe_var(--motion-duration-400)_linear_infinite] w-1/2"
          )}
          style={indeterminate ? undefined : { width: `${percent}%` }}
        />
        <div className="pointer-events-none absolute inset-0 animate-arcana-breathe bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.3),transparent_60%)] opacity-70 mix-blend-screen" />
      </div>
      {description && (
        <p id={descriptionId} className="text-xs text-arcana-text-low">
          {description}
        </p>
      )}
    </div>
  );
}

export interface LinearProgressProps {
  value?: number;
  max?: number;
  indeterminate?: boolean;
  srOnlyLabel?: string;
}

export function LinearProgress({
  value = 0,
  max = 100,
  indeterminate,
  srOnlyLabel = "Loading",
}: LinearProgressProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-label={srOnlyLabel}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={indeterminate ? undefined : value}
      className="relative h-2 w-full overflow-hidden rounded-arcana-pill bg-[rgba(17,25,38,0.5)]"
    >
      <span className="sr-only">{srOnlyLabel}</span>
      <div
        className={cn(
          "absolute inset-y-0 left-0 h-full bg-gradient-to-r from-[rgba(122,108,255,0.95)] to-[rgba(75,217,255,0.95)]",
          indeterminate && "animate-[arcana-reveal_var(--motion-duration-320)_linear_infinite] w-1/3"
        )}
        style={indeterminate ? undefined : { width: `${percent}%` }}
      />
    </div>
  );
}

export function ChaliceProgressExample() {
  const [value, setValue] = React.useState(65);
  return (
    <div className="flex w-full max-w-xl flex-col gap-sm">
      <ChaliceProgress
        value={value}
        label="Chalice Resonance"
        description="Harmonics aligning with lunar canal."
      />
      <LinearProgress value={value} srOnlyLabel="Chalice fill" />
      <ChaliceProgress label="Scrying" indeterminate description="Calculating astral drift" />
      <button
        className="self-start rounded-control-m border border-[color:var(--color-stroke)] bg-transparent px-sm py-xs text-xs text-arcana-text-low"
        onClick={() => setValue((prev) => (prev + 15) % 110)}
      >
        Increment
      </button>
    </div>
  );
}
