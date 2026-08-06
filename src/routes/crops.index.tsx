import { createFileRoute, Link } from "@tanstack/react-router";

import paddyAsset from "@/assets/paddy.jpg.asset.json";
import { CROPS } from "@/lib/crops";

export const Route = createFileRoute("/crops/")({
  head: () => ({
    meta: [
      { title: "Crop Shelf — 3D Agriculture Lab" },
      {
        name: "description",
        content:
          "Browse the lab's crop shelf: paddy rice, wheat, maize, soybean and sugarcane, with taxonomy and field conditions for each.",
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
        <Link
          to="/"
          className="readout text-[10px] uppercase text-muted-foreground transition-colors hover:text-primary"
        >
          ← Back to the lab
        </Link>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight">Crop shelf</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Each specimen opens in the 3D lab. Paddy rice is fully modeled; the rest are queued for
          modeling and show reference data only.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {CROPS.map((crop) => (
            <Link
              key={crop.slug}
              to="/crops/$slug"
              params={{ slug: crop.slug }}
              className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-sm border border-border p-6 transition-colors hover:border-primary/60"
            >
              {crop.modeled ? (
                <img
                  src={paddyAsset.url}
                  alt="Paddy rice plant against a dark backdrop"
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