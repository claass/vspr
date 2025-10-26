"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function Modal({ open, onClose, title, description, children, className, ...props }: ModalProps) {
  const overlayRef = React.useRef<HTMLDivElement | null>(null);
  const headingId = React.useId();
  const descriptionId = React.useId();

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === overlayRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-[color:var(--color-overlay)]/80"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? headingId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "glass-s3 relative w-full max-w-lg rounded-surface-xl border border-[color:var(--color-stroke)] p-lg text-arcana-text-low shadow-arcana-glass-s3 animate-arcana-reveal",
          className
        )}
        {...props}
      >
        <button
          onClick={onClose}
          className="absolute right-sm top-sm rounded-control-m border border-[color:var(--color-stroke)] px-xs py-[0.35rem] text-xs text-arcana-text-low"
        >
          Close
        </button>
        {title && (
          <h2 id={headingId} className="text-2xl font-semibold text-arcana-text-high">
            {title}
          </h2>
        )}
        {description && (
          <p id={descriptionId} className="mt-xs text-sm text-arcana-text-low">
            {description}
          </p>
        )}
        <div className="mt-sm text-sm leading-relaxed text-arcana-text-low">{children}</div>
      </div>
    </div>
  );
}

export function ModalExample() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex flex-col gap-xs">
      <button
        className="self-start rounded-control-m border border-[color:var(--color-stroke)] px-sm py-xs text-sm text-arcana-text-high"
        onClick={() => setOpen(true)}
      >
        Open modal
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Astral Alignment"
        description="Confirm resonance before continuing"
      >
        Continue only if the orb cadence remains below 60 pulses per minute. Sudden surges should be reported to the keeper.
      </Modal>
    </div>
  );
}
