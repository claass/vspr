import * as React from "react";
import { cn } from "@/lib/utils";

export interface DisclaimerBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  tone?: "caution" | "info";
}

export function DisclaimerBlock({ title = "Guidance disclaimer", tone = "info", className, children, ...props }: DisclaimerBlockProps) {
  return (
    <aside
      className={cn(
        "glass-s1 relative flex w-full max-w-xl gap-sm rounded-surface-xl border border-[color:var(--color-stroke)] p-md text-sm text-arcana-text-low shadow-arcana-glass-s1",
        tone === "caution" && "border-[rgba(247,178,91,0.6)]",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-xs">
        <span className="text-xs uppercase tracking-[0.28em] text-arcana-text-low">{title}</span>
        <div className="flex flex-col gap-xs text-arcana-text-high">{children}</div>
        <span className="text-xs text-arcana-text-low">Interpret results with a human overseer present.</span>
      </div>
      <div className="pointer-events-none flex flex-1 items-center justify-center">
        <div className="h-full w-px bg-gradient-to-b from-transparent via-[rgba(75,217,255,0.4)] to-transparent" />
        <div className="ml-sm flex flex-col gap-xs">
          <div className="h-12 w-1 rounded-full bg-gradient-to-b from-[rgba(122,108,255,0.8)] to-transparent" />
          <div className="h-16 w-1 rounded-full bg-gradient-to-b from-[rgba(63,245,195,0.6)] to-transparent" />
        </div>
      </div>
    </aside>
  );
}

export function DisclaimerBlockExample() {
  return (
    <DisclaimerBlock>
      <p>The lumen oracle provides probabilistic guidance. Outcomes remain non-deterministic.</p>
    </DisclaimerBlock>
  );
}
