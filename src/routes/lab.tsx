import { ClientOnly, createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { AnimatePresence } from "motion/react";
import { Dna, Droplets, Expand, Layers, Minimize, Timer } from "lucide-react";

import { RICE } from "@/lib/crops";
import {
  CellsPanel,
  ConditionsPanel,
  LifecyclePanel,
  TaxonomyPanel,
  type PanelId,
} from "@/components/lab/LabDock";

const PaddyScene = lazy(() => import("@/components/lab/PaddyScene"));

export const Route = createFileRoute("/lab")({
  head: () => ({
    meta: [
      { title: "3D Agriculture Lab — Interactive Paddy Rice Model" },
      {
        name: "description",
        content:
          "Explore a real-time 3D model of Oryza sativa: taxonomy, growing conditions, leaf cell structure and a scrubbable lifecycle, in an immersive dark lab.",
      },
      { property: "og:title", content: "3D Agriculture Lab — Interactive Paddy Rice Model" },
      {
        property: "og:description",
        content:
          "Orbit a procedurally grown rice plant, open hotspots and scrub its lifecycle from germination to ripening.",
      },
    ],
  }),
  component: Lab,
});

const TOOLS: { id: PanelId; label: string; icon: typeof Dna }[] = [
  { id: "taxonomy", label: "Taxonomy", icon: Dna },
  { id: "conditions", label: "Conditions", icon: Droplets },
  { id: "cells", label: "Cell structure", icon: Layers },
  { id: "lifecycle", label: "Lifecycle", icon: Timer },
];

const HOTSPOT_PANEL: Record<string, PanelId> = {
  panicle: "lifecycle",
  blade: "cells",
  culm: "taxonomy",
  roots: "conditions",
};

function Lab() {
  const [panel, setPanel] = useState<PanelId | null>("taxonomy");
  const [hotspot, setHotspot] = useState<string | null>(null);
  const [layer, setLayer] = useState<string | null>(null);
  const [stage, setStage] = useState(RICE.lifecycle.length - 1);
  const [immersive, setImmersive] = useState(false);

  const growth = RICE.lifecycle[stage]?.growth ?? 1;
  const activeHotspot = RICE.hotspots.find((h) => h.id === hotspot);

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      <div className="absolute inset-0" style={{ backgroundImage: "var(--gradient-stage)" }} />

      <ClientOnly
        fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="readout text-xs uppercase text-muted-foreground">Warming up the lab…</p>
          </div>
        }
      >
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="readout animate-pulse text-xs uppercase text-primary">
                Growing Oryza sativa…
              </p>
            </div>
          }
        >
          <PaddyScene
            growth={growth}
            immersive={immersive}
            activeHotspot={hotspot}
            onHotspot={(id) => {
              setHotspot(id);
              if (id) setPanel(HOTSPOT_PANEL[id] ?? "taxonomy");
            }}
          />
        </Suspense>
      </ClientOnly>

      {!immersive && (
        <>
          <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-4 p-6">
            <div className="pointer-events-auto">
              <p className="readout text-[10px] uppercase text-primary">3D Agriculture Lab</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
                {RICE.name}
                <span className="ml-3 text-base font-normal italic text-muted-foreground">
                  {RICE.binomial}
                </span>
              </h1>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">{RICE.tagline}</p>
            </div>
            <nav className="pointer-events-auto flex items-center gap-2">
              <Link
                to="/crops"
                className="readout rounded-sm border border-border px-3 py-2 text-[10px] uppercase text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Crop shelf
              </Link>
              <button
                onClick={() => setImmersive(true)}
                className="readout flex items-center gap-2 rounded-sm border border-primary/50 px-3 py-2 text-[10px] uppercase text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Expand className="size-3" /> Immersive
              </button>
            </nav>
          </header>

          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 flex items-center p-4">
            <div className="panel-glass pointer-events-auto flex flex-col gap-1 rounded-sm p-1.5">
              {TOOLS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setPanel(panel === t.id ? null : t.id)}
                  title={t.label}
                  aria-label={t.label}
                  className={`flex size-10 items-center justify-center rounded-sm transition-colors ${
                    panel === t.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <t.icon className="size-4" />
                </button>
              ))}
            </div>
          </div>

          {activeHotspot && (
            <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 w-[min(28rem,calc(100%-3rem))] -translate-x-1/2">
              <div className="panel-glass rounded-sm px-5 py-4">
                <p className="readout text-[10px] uppercase text-grain">{activeHotspot.label}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {activeHotspot.blurb}
                </p>
              </div>
            </div>
          )}

          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 flex w-full max-w-full items-stretch p-4 md:w-auto">
            <AnimatePresence mode="wait">
              {panel === "taxonomy" && (
                <TaxonomyPanel key="taxonomy" crop={RICE} onClose={() => setPanel(null)} />
              )}
              {panel === "conditions" && (
                <ConditionsPanel key="conditions" crop={RICE} onClose={() => setPanel(null)} />
              )}
              {panel === "cells" && (
                <CellsPanel
                  key="cells"
                  crop={RICE}
                  activeLayer={layer}
                  onLayer={setLayer}
                  onClose={() => setPanel(null)}
                />
              )}
              {panel === "lifecycle" && (
                <LifecyclePanel
                  key="lifecycle"
                  crop={RICE}
                  stage={stage}
                  onStage={setStage}
                  onClose={() => setPanel(null)}
                />
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      {immersive && (
        <button
          onClick={() => setImmersive(false)}
          className="readout absolute left-1/2 top-6 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-primary/40 bg-background/60 px-4 py-2 text-[10px] uppercase text-primary backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <Minimize className="size-3" /> Exit immersive
        </button>
      )}
    </main>
  );
}
