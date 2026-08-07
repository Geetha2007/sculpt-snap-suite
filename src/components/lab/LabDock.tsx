import { lazy, Suspense, useEffect, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play, RotateCcw, X } from "lucide-react";

import type { Crop } from "@/lib/crops";

const CellScene = lazy(() => import("./CellScene"));

export type PanelId = "taxonomy" | "conditions" | "cells" | "lifecycle";

function PanelShell({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 28 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="panel-glass pointer-events-auto flex h-full w-full flex-col rounded-sm md:w-[26rem]"
    >
      <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
        <div>
          <p className="readout text-[10px] uppercase text-primary">{subtitle}</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight">{title}</h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close panel"
          className="rounded-sm border border-border p-1.5 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <X className="size-3.5" />
        </button>
      </header>
      <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
    </motion.aside>
  );
}

export function TaxonomyPanel({ crop, onClose }: { crop: Crop; onClose: () => void }) {
  return (
    <PanelShell title="Biological taxonomy" subtitle="Classification" onClose={onClose}>
      <p className="text-sm leading-relaxed text-muted-foreground">{crop.summary}</p>
      <dl className="mt-5 divide-y divide-border border-y border-border">
        {crop.taxonomy.map((row) => (
          <div key={row.rank} className="flex items-baseline justify-between gap-4 py-2.5">
            <dt className="readout text-[10px] uppercase text-muted-foreground">{row.rank}</dt>
            <dd className="text-right text-sm italic">{row.value}</dd>
          </div>
        ))}
      </dl>
    </PanelShell>
  );
}

export function ConditionsPanel({ crop, onClose }: { crop: Crop; onClose: () => void }) {
  return (
    <PanelShell title="Growing conditions" subtitle="Field envelope" onClose={onClose}>
      <div className="space-y-4">
        {crop.conditions.map((m) => (
          <div key={m.label}>
            <div className="flex items-baseline justify-between">
              <span className="text-sm">{m.label}</span>
              <span className="readout text-xs text-primary">{m.value}</span>
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-secondary">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${m.fill * 100}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
              />
            </div>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

export function CellsPanel({
  crop,
  activeLayer,
  onLayer,
  onClose,
}: {
  crop: Crop;
  activeLayer: string | null;
  onLayer: (id: string | null) => void;
  onClose: () => void;
}) {
  return (
    <PanelShell title="Cellular structure" subtitle="Leaf cross-section" onClose={onClose}>
      <div className="h-52 w-full overflow-hidden rounded-sm border border-border">
        <ClientOnly fallback={<div className="h-full w-full bg-secondary/40" />}>
          <Suspense fallback={<div className="h-full w-full bg-secondary/40" />}>
            <CellScene layers={crop.cells} active={activeLayer} />
          </Suspense>
        </ClientOnly>
      </div>
      <ul className="mt-4 space-y-2">
        {crop.cells.map((layer) => (
          <li key={layer.id}>
            <button
              onClick={() => onLayer(activeLayer === layer.id ? null : layer.id)}
              className={`w-full rounded-sm border px-3 py-2.5 text-left transition-colors ${
                activeLayer === layer.id
                  ? "border-primary bg-accent"
                  : "border-border hover:border-primary/60"
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: layer.color }}
                  aria-hidden
                />
                {layer.name}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                {layer.note}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </PanelShell>
  );
}

export function LifecyclePanel({
  crop,
  stage,
  onStage,
  onClose,
}: {
  crop: Crop;
  stage: number;
  onStage: (i: number) => void;
  onClose: () => void;
}) {
  const current = crop.lifecycle[stage];
  const last = crop.lifecycle.length - 1;
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      onStage(stage >= last ? last : stage + 1);
      if (stage >= last) setPlaying(false);
    }, 1400);
    return () => clearInterval(t);
  }, [playing, stage, last, onStage]);

  return (
    <PanelShell
      title="Lifecycle timeline"
      subtitle={`Stage ${stage + 1} of ${last + 1} · ${crop.lifecycle[0]?.name} → ${crop.lifecycle[last]?.name}`}
      onClose={onClose}
    >
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={() => {
            if (stage >= last) onStage(0);
            setPlaying((p) => !p);
          }}
          className="readout flex items-center gap-2 rounded-sm border border-primary/50 px-3 py-2 text-[10px] uppercase text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          {playing ? <Pause className="size-3" /> : <Play className="size-3" />}
          {playing ? "Pause growth" : "Grow start → end"}
        </button>
        <button
          onClick={() => {
            setPlaying(false);
            onStage(0);
          }}
          aria-label="Reset to first stage"
          className="flex size-9 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <RotateCcw className="size-3.5" />
        </button>
      </div>
      <input
        type="range"
        min={0}
        max={crop.lifecycle.length - 1}
        step={1}
        value={stage}
        onChange={(e) => onStage(Number(e.target.value))}
        aria-label="Lifecycle stage"
        className="w-full accent-[var(--primary)]"
      />
      <ol className="mt-4 space-y-1">
        {crop.lifecycle.map((s, i) => {
          const active = i === stage;
          return (
            <li key={s.id}>
              <button
                onClick={() => {
                  setPlaying(false);
                  onStage(i);
                }}
                className={`flex w-full items-baseline gap-3 rounded-sm border px-3 py-2 text-left transition-colors ${
                  active
                    ? "border-primary/60 bg-primary/10"
                    : i < stage
                      ? "border-border/60 text-muted-foreground hover:border-primary/40"
                      : "border-transparent text-muted-foreground hover:border-border"
                }`}
              >
                <span
                  className={`readout text-[9px] uppercase ${active ? "text-primary" : "text-muted-foreground"}`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`flex-1 text-sm ${active ? "font-semibold text-foreground" : ""}`}>
                  {s.name}
                </span>
                <span className="readout text-[9px] uppercase text-muted-foreground">{s.days}</span>
              </button>
            </li>
          );
        })}
      </ol>
      {current && (
        <div className="mt-4 rounded-sm border border-border bg-secondary/40 p-4">
          <p className="readout text-[10px] uppercase text-grain">
            {current.days} · {Math.round(current.growth * 100)}% grown
          </p>
          <h3 className="mt-1 text-base font-semibold">{current.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{current.note}</p>
        </div>
      )}
    </PanelShell>
  );
}

export { AnimatePresence };