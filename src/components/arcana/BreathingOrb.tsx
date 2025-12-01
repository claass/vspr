"use client";

import * as React from "react";

export interface BreathingOrbProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: number;
  label?: string;
  animated?: boolean;
}

export function BreathingOrb({ intensity = 0.6, label = "Orb", animated = true, className, ...props }: BreathingOrbProps) {
  const scaled = Math.max(0, Math.min(1, intensity));
  return (
    <div className={"flex flex-col items-center gap-xs text-arcana-text-high"} {...props}>
      <div
        data-animated={animated}
        className={"breathing-orb relative h-32 w-32 rounded-full bg-gradient-to-br from-[rgba(122,108,255,0.7)] via-[rgba(75,217,255,0.6)] to-[rgba(63,245,195,0.6)] shadow-[0_0_40px_rgba(122,108,255,0.5)]" +
          (animated ? " animate-arcana-breathe" : "") +
          (className ? ` ${className}` : "")}
        style={{ opacity: 0.7 + scaled * 0.3 }}
      >
        <div className="absolute inset-4 rounded-full border border-[rgba(255,255,255,0.3)]" />
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.5),transparent_55%)]" />
      </div>
      <span className="text-sm uppercase tracking-[0.28em] text-arcana-text-low">{label}</span>
      <span className="font-['Space_Grotesk'] text-3xl font-semibold">{Math.round(scaled * 100)}%</span>
    </div>
  );
}

export function BreathingOrbExample() {
  return <BreathingOrb intensity={0.72} label="Resonance" />;
}
