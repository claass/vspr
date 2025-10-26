"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, min = 0, max = 100, step = 1, id, ...props }, ref) => {
    const generatedId = React.useId();
    const sliderId = id ?? generatedId;
    const [value, setValue] = React.useState(Number(props.defaultValue ?? props.value ?? min));
    const currentValue = Number(props.value ?? value);
    return (
      <div className="flex w-full max-w-md flex-col gap-xs">
        {label && (
          <label htmlFor={sliderId} className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-arcana-text-low">
            <span>{label}</span>
            <span className="font-['JetBrains_Mono'] text-arcana-text-high">{currentValue}</span>
          </label>
        )}
        <input
          id={sliderId}
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (props.onChange) props.onChange(event);
            if (props.value === undefined) {
              setValue(next);
            }
          }}
          className={cn(
            "h-11 w-full appearance-none rounded-arcana-pill bg-[rgba(17,25,38,0.1)] focus:outline-none",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-accent)]",
            className
          )}
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(122,108,255,0.9) 0%, rgba(63,245,195,0.9) " +
              `${((currentValue - min) / (max - min)) * 100}%` +
              ", rgba(17,25,38,0.3) " +
              `${((currentValue - min) / (max - min)) * 100}%` +
              ")",
          }}
          {...props}
        />
      </div>
    );
  }
);

Slider.displayName = "Slider";

export function SliderExample() {
  return <Slider label="Orb cadence" defaultValue={48} max={120} />;
}
