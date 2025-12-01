"use client";

import * as React from "react";

export interface ToastProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Toast({ message, actionLabel, onAction, open = true, onOpenChange }: ToastProps) {
  const [visible, setVisible] = React.useState(open);

  React.useEffect(() => {
    setVisible(open);
  }, [open]);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    onOpenChange?.(false);
  };

  return (
    <div className="fixed bottom-lg left-1/2 z-[var(--z-toast)] w-[min(360px,90vw)] -translate-x-1/2">
      <div className="glass-s2 flex items-center justify-between gap-sm rounded-control-m border border-[color:var(--color-stroke)] px-md py-sm text-sm text-arcana-text-high shadow-arcana-glass-s2">
        <span>{message}</span>
        <div className="flex items-center gap-xs">
          {actionLabel && (
            <button
              onClick={() => {
                onAction?.();
                dismiss();
              }}
              className="rounded-control-m border border-[color:var(--color-stroke)] px-xs py-[0.35rem] text-xs uppercase tracking-[0.2em] text-arcana-text-high"
            >
              {actionLabel}
            </button>
          )}
          <button
            onClick={dismiss}
            className="rounded-control-m border border-[color:var(--color-stroke)] px-xs py-[0.35rem] text-xs text-arcana-text-low"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export function ToastExample() {
  return <Toast message="Orb resonance stabilized." actionLabel="Undo" onAction={() => console.log("undo")} />;
}
