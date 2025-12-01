import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  actions?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, title, actions, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          "glass-s3 relative flex w-full max-w-sm flex-col gap-sm rounded-surface-xl border border-[color:var(--color-stroke)]",
          "p-md text-arcana-text-low shadow-arcana-glass-s3",
          className
        )}
        {...props}
      >
        {title && (
          <header className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-arcana-text-high">{title}</h3>
            {actions}
          </header>
        )}
        <div className="text-sm leading-relaxed text-arcana-text-low">{children}</div>
      </section>
    );
  }
);

Card.displayName = "Card";

export function CardExample() {
  return (
    <Card
      title="Tarot Seed"
      actions={<span className="text-xs text-arcana-text-low">#042</span>}
    >
      Channel lunar resonance before sunrise to amplify the scrying orb. Maintain the chant for 8 beats.
    </Card>
  );
}
