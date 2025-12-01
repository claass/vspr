import * as React from "react";
import { cn } from "@/lib/utils";

export interface ExplainabilityFilamentsProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Array<{ label: string; value: number; color?: string }>;
}

export function ExplainabilityFilaments({ data, className, ...props }: ExplainabilityFilamentsProps) {
  return (
    <div
      className={cn(
        "glass-s2 flex w-full max-w-xl flex-col gap-sm rounded-surface-xl border border-[color:var(--color-stroke)] p-md text-arcana-text-high shadow-arcana-glass-s2",
        className
      )}
      {...props}
    >
      <header className="text-xs uppercase tracking-[0.28em] text-arcana-text-low">Explainability filaments</header>
      <div className="flex flex-col gap-sm">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-sm">
            <span className="min-w-[120px] text-sm text-arcana-text-low">{item.label}</span>
            <div className="relative h-2 flex-1 overflow-hidden rounded-arcana-pill bg-[rgba(17,25,38,0.5)]">
              <span
                className="absolute inset-y-0 left-0"
                style={{
                  width: `${Math.min(100, Math.max(0, item.value))}%`,
                  background:
                    item.color ??
                    "linear-gradient(90deg, rgba(122,108,255,0.8), rgba(75,217,255,0.7), rgba(63,245,195,0.7))",
                }}
              />
            </div>
            <span className="w-12 text-right text-sm font-semibold text-arcana-text-high">
              {Math.round(item.value)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExplainabilityFilamentsExample() {
  return (
    <ExplainabilityFilaments
      data={[
        { label: "Lunar drift", value: 72 },
        { label: "Orb cadence", value: 54 },
        { label: "Candle glow", value: 32 },
      ]}
    />
  );
}
