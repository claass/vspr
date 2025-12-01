"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SegmentedControlOption {
  id: string;
  label: string;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  ariaLabel?: string;
}

export function SegmentedControl({
  options,
  value,
  defaultValue,
  onValueChange,
  ariaLabel,
}: SegmentedControlProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? options[0]?.id);
  const currentValue = value ?? internalValue;

  const handleClick = (id: string) => {
    if (!value) {
      setInternalValue(id);
    }
    onValueChange?.(id);
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex rounded-control-m border border-[color:var(--color-stroke)] bg-arcana-surface-1 p-[4px] shadow-arcana-glass-s1"
    >
      {options.map((option) => {
        const active = option.id === currentValue;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => handleClick(option.id)}
            className={cn(
              "relative mx-[1px] flex min-h-[44px] min-w-[96px] items-center justify-center rounded-control-m px-sm py-[0.35rem] text-sm font-semibold",
              "transition-all duration-160 ease-[var(--motion-ease-standard)] focus-visible:outline focus-visible:outline-2",
              "focus-visible:outline-offset-1 focus-visible:outline-[color:var(--color-accent)]",
              active
                ? "bg-arcana-surface-3 text-arcana-text-high shadow-arcana-glass-s2"
                : "text-arcana-text-low hover:text-arcana-text-high"
            )}
          >
            <span className="pointer-events-none absolute inset-0 rounded-control-m bg-gradient-to-br from-[rgba(122,108,255,0.25)] to-[rgba(63,245,195,0.2)] opacity-0 transition-opacity duration-200 group-hover:opacity-80" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function SegmentedControlExample() {
  const [alignment, setAlignment] = React.useState("left");
  return (
    <SegmentedControl
      options={[
        { id: "left", label: "Left" },
        { id: "center", label: "Center" },
        { id: "right", label: "Right" },
      ]}
      value={alignment}
      onValueChange={setAlignment}
      ariaLabel="Alignment"
    />
  );
}
