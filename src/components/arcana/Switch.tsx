"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked, defaultChecked, onCheckedChange, disabled, label, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = React.useState(!!defaultChecked);
    const isControlled = typeof checked === "boolean";
    const isOn = isControlled ? checked : internalChecked;

    const toggle = () => {
      if (disabled) return;
      const next = !isOn;
      if (!isControlled) {
        setInternalChecked(next);
      }
      onCheckedChange?.(next);
    };

    return (
      <button
        ref={ref}
        role="switch"
        type="button"
        aria-checked={isOn}
        aria-label={label}
        onClick={toggle}
        disabled={disabled}
        className={cn(
          "relative inline-flex h-11 w-20 items-center rounded-arcana-pill border border-[color:var(--color-stroke)] bg-arcana-surface-1 px-[0.35rem]",
          "transition-all duration-160 ease-[var(--motion-ease-standard)] focus-visible:outline focus-visible:outline-2",
          "focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-accent)]",
          isOn ? "shadow-arcana-glass-s2" : "shadow-arcana-glass-s1",
          disabled ? "cursor-not-allowed opacity-60" : "hover:shadow-arcana-glass-s3",
          className
        )}
        {...props}
      >
          <span
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[rgba(122,108,255,0.6)] to-[rgba(75,217,255,0.5)] transition-all",
              isOn ? "translate-x-[calc(100%-2.1rem)]" : "translate-x-0"
            )}
          >
            <span className="h-3.5 w-3.5 rounded-full bg-arcana-text-high shadow-[0_0_10px_rgba(123,108,255,0.5)]" />
          </span>
      </button>
    );
  }
);

Switch.displayName = "Switch";

export function SwitchExample() {
  return <Switch label="Enable filaments" defaultChecked />;
}
