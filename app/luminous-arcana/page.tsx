"use client";

import { ResinButtonExample } from "@/components/arcana/ResinButton";
import { CandleToggleExample } from "@/components/arcana/CandleToggle";
import { CoinTabsExample } from "@/components/arcana/CoinTabs";
import { ChaliceProgressExample } from "@/components/arcana/ChaliceProgress";
import { TextFieldExample } from "@/components/arcana/TextField";
import { SegmentedControlExample } from "@/components/arcana/SegmentedControl";
import { SliderExample } from "@/components/arcana/Slider";
import { SwitchExample } from "@/components/arcana/Switch";
import { CardExample } from "@/components/arcana/Card";
import { SheetExample } from "@/components/arcana/Sheet";
import { ModalExample } from "@/components/arcana/Modal";
import { TooltipExample } from "@/components/arcana/Tooltip";
import { ToastExample } from "@/components/arcana/Toast";
import { TarotCardExample } from "@/components/arcana/TarotCard";
import { DisclaimerBlockExample } from "@/components/arcana/DisclaimerBlock";
import { QABlockExample } from "@/components/arcana/QABlock";
import { BreathingOrbExample } from "@/components/arcana/BreathingOrb";
import { ExplainabilityFilamentsExample } from "@/components/arcana/ExplainabilityFilaments";

export default function LuminousArcanaPage() {
  return (
    <main className="min-h-screen bg-[color:var(--color-neutral-n0)] py-16 text-arcana-text-high">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6">
        <header className="flex flex-col gap-4 text-center">
          <h1 className="text-5xl font-semibold">Luminous Arcana Playground</h1>
          <p className="text-arcana-text-low">
            Preview the resin, candle, chalice, tarot, and guidance components in one place. Toggle low-power via the root .low-power class.
          </p>
        </header>
        <section className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-8">
            <ResinButtonExample />
            <CandleToggleExample />
            <CoinTabsExample />
            <SegmentedControlExample />
            <SliderExample />
            <SwitchExample />
            <TooltipExample />
          </div>
          <div className="flex flex-col gap-8">
            <ChaliceProgressExample />
            <TextFieldExample />
            <CardExample />
            <TarotCardExample />
            <BreathingOrbExample />
            <ExplainabilityFilamentsExample />
          </div>
        </section>
        <section className="grid grid-cols-1 gap-8">
          <DisclaimerBlockExample />
          <QABlockExample />
          <SheetExample />
          <ModalExample />
          <ToastExample />
        </section>
      </div>
    </main>
  );
}
