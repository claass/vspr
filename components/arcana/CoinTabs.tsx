"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CoinTabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export type CoinTabsSize = "sm" | "md" | "lg";

export interface CoinTabsProps {
  items: CoinTabItem[];
  size?: CoinTabsSize;
  selectedId?: string;
  defaultSelectedId?: string;
  onSelect?: (id: string) => void;
  ariaLabel?: string;
}

const sizePadding: Record<CoinTabsSize, string> = {
  sm: "min-h-[44px] px-sm py-[0.35rem] text-sm",
  md: "min-h-[48px] px-md py-[0.45rem] text-base",
  lg: "min-h-[56px] px-lg py-[0.55rem] text-lg",
};

export function CoinTabs({
  items,
  size = "md",
  selectedId,
  defaultSelectedId,
  onSelect,
  ariaLabel,
}: CoinTabsProps) {
  const [internalSelection, setInternalSelection] = React.useState(
    defaultSelectedId ?? items[0]?.id
  );
  const current = selectedId ?? internalSelection;

  const handleSelect = (id: string) => {
    if (!selectedId) {
      setInternalSelection(id);
    }
    onSelect?.(id);
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="relative flex gap-xs overflow-x-auto rounded-control-m border border-[color:var(--color-stroke)] bg-arcana-surface-1 p-[2px] shadow-arcana-glass-s1"
    >
      {items.map((item) => {
        const isActive = current === item.id;
        return (
          <button
            key={item.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => handleSelect(item.id)}
            className={cn(
              "group relative flex shrink-0 items-center gap-2 rounded-control-m transition-all",
              "duration-160 ease-[var(--motion-ease-standard)] focus-visible:outline focus-visible:outline-2",
              "focus-visible:outline-offset-1 focus-visible:outline-[color:var(--color-accent)]",
              sizePadding[size],
              isActive
                ? "bg-arcana-surface-3 text-arcana-text-high shadow-arcana-glass-s2"
                : "text-arcana-text-low hover:text-arcana-text-high"
            )}
          >
            <span className="pointer-events-none absolute inset-0 -z-10 rounded-control-m bg-gradient-to-br from-[rgba(122,108,255,0.32)] via-transparent to-[rgba(63,245,195,0.22)] opacity-0 transition-opacity duration-200 group-hover:opacity-80" />
            {item.icon}
            <span className="font-semibold tracking-wide">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function CoinTabsExample() {
  const options: CoinTabItem[] = [
    { id: "dawn", label: "Dawn" },
    { id: "zenith", label: "Zenith" },
    { id: "eclipse", label: "Eclipse" },
  ];
  const [active, setActive] = React.useState(options[0]?.id);
  return (
    <CoinTabs
      items={options}
      size="md"
      selectedId={active}
      onSelect={setActive}
      ariaLabel="Choose coin"
    />
  );
}
