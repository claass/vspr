import * as React from "react";
import { cn } from "@/lib/utils";

export interface TarotCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  number: string;
  suit: string;
  reversed?: boolean;
  emblem?: React.ReactNode;
}

export const TarotCard = React.forwardRef<HTMLDivElement, TarotCardProps>(
  ({ title, number, suit, reversed = false, emblem, className, ...props }, ref) => {
    return (
      <article
        ref={ref}
        className={cn(
          "glass-s3 group relative aspect-[2/3] w-48 overflow-hidden rounded-surface-xl border border-[color:var(--color-stroke)] p-sm text-arcana-text-high shadow-arcana-glass-s3",
          reversed && "rotate-180",
          className
        )}
        aria-label={`${title} ${reversed ? "reversed" : "upright"}`}
        {...props}
      >
        <div className={cn("flex h-full flex-col justify-between", reversed && "rotate-180")}
        >
          <header className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-arcana-text-low">
            <span>{suit}</span>
            <span style={{ fontSize: "18%" }} className="font-['JetBrains_Mono'] text-arcana-text-high">
              {number}
            </span>
          </header>
          <div className="flex flex-1 items-center justify-center">
            <div className="relative flex h-full w-full items-center justify-center rounded-surface-xl border border-[rgba(255,255,255,0.12)] bg-[rgba(17,25,38,0.45)]">
              {emblem ?? (
                <span className="text-5xl font-semibold tracking-[0.12em] text-arcana-text-high">
                  ✶
                </span>
              )}
            </div>
          </div>
          <footer className="pt-xs text-center text-sm font-semibold tracking-wide text-arcana-text-high">
            {title}
          </footer>
        </div>
      </article>
    );
  }
);

TarotCard.displayName = "TarotCard";

export function TarotCardExample() {
  return (
    <div className="flex gap-sm">
      <TarotCard title="The Veil" number="II" suit="Arcana" />
      <TarotCard title="The Veil" number="II" suit="Arcana" reversed />
    </div>
  );
}
