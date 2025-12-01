"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  label: string;
  children: React.ReactNode;
}

export function Tooltip({ label, children }: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();
  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span aria-describedby={id}>{children}</span>
      {open && (
        <span
          role="tooltip"
          id={id}
          className={cn(
            "glass-s1 absolute left-1/2 top-full mt-xs w-max -translate-x-1/2 rounded-control-m px-sm py-[0.35rem] text-xs text-arcana-text-high shadow-arcana-glass-s1"
          )}
        >
          {label}
        </span>
      )}
    </span>
  );
}

export function TooltipExample() {
  return (
    <Tooltip label="Explains the orb cadence">
      <span className="cursor-help text-arcana-text-high underline">Orb cadence</span>
    </Tooltip>
  );
}
