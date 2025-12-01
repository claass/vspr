import * as React from "react";
import { cn } from "@/lib/utils";

export interface QAItem {
  question: string;
  answer: string;
}

export interface QABlockProps extends React.HTMLAttributes<HTMLDivElement> {
  items: QAItem[];
}

export function QABlock({ items, className, ...props }: QABlockProps) {
  return (
    <section
      className={cn(
        "glass-s2 flex w-full max-w-xl flex-col gap-sm rounded-surface-xl border border-[color:var(--color-stroke)] p-md text-arcana-text-low shadow-arcana-glass-s2",
        className
      )}
      {...props}
    >
      <header className="text-xs uppercase tracking-[0.28em] text-arcana-text-low">QA channel</header>
      <div className="flex flex-col divide-y divide-[rgba(255,255,255,0.08)]">
        {items.map((item, index) => (
          <article key={index} className="py-xs">
            <h4 className="text-sm font-semibold text-arcana-text-high">{item.question}</h4>
            <p className="mt-[0.25rem] text-sm leading-relaxed text-arcana-text-low">{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function QABlockExample() {
  return (
    <QABlock
      items={[
        {
          question: "Is the orb cadence safe?",
          answer: "Yes. Maintain under 60 pulses per minute to avoid resonance feedback.",
        },
        {
          question: "When does the chalice reset?",
          answer: "Upon sunrise or when the keeper seals the conduit manually.",
        },
      ]}
    />
  );
}
