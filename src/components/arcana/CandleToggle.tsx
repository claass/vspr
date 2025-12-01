"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CandleToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
}

export const CandleToggle = React.forwardRef<HTMLButtonElement, CandleToggleProps>(
  (
    { className, checked, defaultChecked, disabled, onCheckedChange, label, ...props },
    ref
  ) => {
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(!!defaultChecked);
    const isControlled = typeof checked === "boolean";
    const isOn = isControlled ? checked : uncontrolledChecked;

    const toggle = () => {
      if (disabled) return;
      const next = !isOn;
      if (!isControlled) {
        setUncontrolledChecked(next);
      }
      onCheckedChange?.(next);
    };

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isOn}
        aria-label={label}
        data-animated="true"
        className={cn(
          "candle-toggle relative inline-flex h-14 w-28 items-center justify-between overflow-hidden",
          "rounded-control-m border border-[color:var(--color-stroke)] bg-arcana-surface-2 px-sm text-arcana-text-low",
          "shadow-arcana-glass-s2 transition-all duration-200 ease-[var(--motion-ease-standard)]",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-accent)]",
          disabled ? "cursor-not-allowed opacity-60" : "hover:shadow-arcana-glass-s3",
          className
        )}
        onClick={toggle}
        disabled={disabled}
        {...props}
      >
        <span
          className={cn(
            "relative flex h-8 w-8 items-center justify-center rounded-full transition-all",
            isOn ? "translate-x-12" : "translate-x-0"
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "relative flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(247,178,91,0.28)]",
              "shadow-[0_0_12px_rgba(247,178,91,0.45)] transition-all duration-200 ease-[var(--motion-ease-standard)]",
              isOn ? "animate-arcana-pulse" : "animate-arcana-glow-off"
            )}
          >
            <span
              className={cn(
                "relative h-5 w-2 rounded-full bg-gradient-to-b from-[#fff0d4] to-[#f7b55b]",
                "shadow-[0_-2px_8px_rgba(255,255,255,0.4)]",
                !isOn && "opacity-60"
              )}
            />
          </span>
        </span>
        <span className="text-sm font-medium tracking-wide text-arcana-text-high">
          {isOn ? "Illumed" : "Dormant"}
        </span>
      </button>
    );
  }
);

CandleToggle.displayName = "CandleToggle";

export function CandleToggleExample() {
  return <CandleToggle label="Toggle candle" defaultChecked />;
}
