import { createFileRoute, Link } from "@tanstack/react-router";

import paddyAsset from "@/assets/paddy.jpg.asset.json";
import wheatAsset from "@/assets/wheat.jpg.asset.json";
import { CROPS } from "@/lib/crops";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Crop Shelf — 3D Agriculture Lab" },
      {
        name: "description",
        content:
          "Start at the crop shelf: paddy rice, wheat, maize, soybean and sugarcane, then step into the interactive 3D lab.",
      },
      { property: "og:title", content: "Crop Shelf — 3D Agriculture Lab" },
      {
        property: "og:description",
        content: "A cinematic shelf of crops, starting with a fully modeled 3D paddy rice plant.",
      },
    ],
  }),
  component: CropShelf,
});

function CropShelf() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <p className="readout text-[10px] uppercase text-primary">3D Agriculture Lab</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Crop shelf</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Pick a specimen to open it in the 3D lab. Paddy rice is fully modeled; the rest are queued
          for modeling and show reference data only.
        </p>
        <Link
          to="/lab"
          search={{ crop: "rice" }}
          className="readout mt-6 inline-flex rounded-sm border border-primary/50 px-4 py-2.5 text-[10px] uppercase text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          Enter the 3D lab →
        </Link>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {CROPS.map((crop) => (
            <Link
              key={crop.slug}
              to="/lab"
              search={{ crop: crop.slug }}
              className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-sm border border-border p-6 transition-colors hover:border-primary/60"
            >
              {crop.modeled ? (
                <img
                  src={crop.slug === "wheat" ? wheatAsset.url : paddyAsset.url}
                  alt={`${crop.name} plant specimen`}
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover opacity-45 transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-secondary to-background" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
              <div className="relative">
                <span className="readout text-[10px] uppercase text-primary">
                  {crop.modeled ? "3D model ready" : "Reference only"}
                </span>
                <h2 className="mt-1.5 text-2xl font-semibold tracking-tight">{crop.name}</h2>
                <p className="italic text-sm text-muted-foreground">{crop.binomial}</p>
                <p className="mt-2 text-sm text-muted-foreground">{crop.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}