"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ResinButtonVariant = "primary" | "accent" | "ghost";
type ResinButtonSize = "sm" | "md" | "lg";

export interface ResinButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  variant?: ResinButtonVariant;
  size?: ResinButtonSize;
  busy?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<ResinButtonVariant, string> = {
  primary:
    "bg-arcana-surface-2 text-arcana-text-high shadow-arcana-glass-s2 glass-s2",
  accent:
    "bg-arcana-surface-3 text-arcana-text-high shadow-arcana-glass-s3 glass-s2 border border-transparent",
  ghost:
    "bg-transparent text-arcana-text-high glass-s1 shadow-arcana-glass-s1",
};

const sizeStyles: Record<ResinButtonSize, string> = {
  sm: "h-11 px-sm text-sm",
  md: "h-12 px-md text-base",
  lg: "h-14 px-lg text-lg",
};

export const ResinButton = React.forwardRef<HTMLButtonElement, ResinButtonProps>(
  (
    { className, variant = "primary", size = "md", busy = false, disabled, icon, children, ...props },
    ref
  ) => {
    const isDisabled = disabled || busy;
    return (
      <button
        ref={ref}
        type="button"
        data-variant={variant}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 font-semibold tracking-wide transition-all",
          "duration-200 ease-[var(--motion-ease-standard)] rounded-control-m focus-visible:outline focus-visible:outline-2",
          "focus-visible:outline-offset-3 focus-visible:outline-[color:var(--color-accent)]",
          "before:pointer-events-none before:absolute before:inset-0 before:rounded-inherit before:bg-gradient-to-r",
          "before:from-[rgba(123,108,255,0.24)] before:to-[rgba(63,245,195,0.16)] before:opacity-0",
          "hover:before:opacity-70 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60",
          "aria-busy:pointer-events-none aria-disabled:opacity-60",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        aria-busy={busy}
        aria-disabled={isDisabled}
        disabled={isDisabled}
        {...props}
      >
        {busy && (
          <span
            className="absolute inset-y-0 left-3 flex w-5 items-center justify-center"
            aria-hidden="true"
          >
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-arcana-text-low border-t-transparent" />
          </span>
        )}
        {icon && !busy && <span className="flex h-5 w-5 items-center justify-center">{icon}</span>}
        <span className={cn(busy ? "pl-6" : "", "flex items-center gap-2")}>{children}</span>
      </button>
    );
  }
);

ResinButton.displayName = "ResinButton";

export function ResinButtonExample() {
  return (
    <div className="flex flex-wrap gap-sm">
      <ResinButton>Cast Spell</ResinButton>
      <ResinButton variant="accent">Reveal Path</ResinButton>
      <ResinButton variant="ghost" disabled>
        Locked Rite
      </ResinButton>
      <ResinButton busy aria-label="Summoning">
        Summoning
      </ResinButton>
    </div>
  );
}
