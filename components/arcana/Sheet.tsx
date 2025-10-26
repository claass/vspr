"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SheetProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  title?: string;
}

export function Sheet({ open, onClose, title, children, className, ...props }: SheetProps) {
  const headingId = React.useId();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[var(--z-overlay)] flex justify-end bg-[color:var(--color-overlay)]/70">
      <div
        className={cn(
          "glass-s3 relative h-full w-full max-w-md overflow-y-auto border-l border-[color:var(--color-stroke)] p-lg text-arcana-text-low shadow-arcana-glass-s3",
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? headingId : undefined}
        {...props}
      >
        <button
          onClick={onClose}
          className="absolute right-sm top-sm rounded-control-m border border-[color:var(--color-stroke)] px-xs py-[0.35rem] text-xs text-arcana-text-low"
        >
          Close
        </button>
        {title && (
          <h2 id={headingId} className="mb-sm text-xl font-semibold text-arcana-text-high">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}

export function SheetExample() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex flex-col gap-xs">
      <button
        className="self-start rounded-control-m border border-[color:var(--color-stroke)] px-sm py-xs text-sm text-arcana-text-high"
        onClick={() => setOpen(true)}
      >
        Open sheet
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Conduit">
        <p className="text-sm leading-relaxed">
          Maintain a calm resonance while the chalice calibrates. Closing the sheet keeps progress.
        </p>
      </Sheet>
    </div>
  );
}
