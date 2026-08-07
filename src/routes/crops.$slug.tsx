import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { getCrop, type Crop } from "@/lib/crops";

export const Route = createFileRoute("/crops/$slug")({
  loader: ({ params }) => {
    const crop = getCrop(params.slug);
    if (!crop) throw notFound();
    return { crop };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Unavailable — 3D Agriculture Lab" }, { name: "robots", content: "noindex" }],
      };
    }
    const { crop } = loaderData;
    const title = `${crop.name} (${crop.binomial}) — 3D Agriculture Lab`;
    return {
      meta: [
        { title },
        { name: "description", content: crop.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: crop.summary },
      ],
    };
  },
  component: CropDetail,
});

function CropDetail() {
  const { crop } = Route.useLoaderData() as { crop: Crop };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <Link
          to="/"
          className="readout text-[10px] uppercase text-muted-foreground transition-colors hover:text-primary"
        >
          ← Crop shelf
        </Link>
        <p className="readout mt-5 text-[10px] uppercase text-primary">
          {crop.modeled ? "3D model ready" : "Not modeled yet"}
        </p>
        <h1 className="mt-1.5 text-4xl font-semibold tracking-tight">{crop.name}</h1>
        <p className="text-lg italic text-muted-foreground">{crop.binomial}</p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {crop.summary}
        </p>

        {crop.modeled ? (
          <Link
            to="/lab"
            className="readout mt-7 inline-flex rounded-sm border border-primary/50 px-4 py-2.5 text-[10px] uppercase text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Open in the 3D lab
          </Link>
        ) : (
          <p className="mt-7 rounded-sm border border-border bg-secondary/40 px-5 py-4 text-sm text-muted-foreground">
            An interactive 3D model for this crop hasn&apos;t been built yet. Reference data below.
          </p>
        )}

        <section className="mt-12 grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="readout text-[10px] uppercase text-muted-foreground">Taxonomy</h2>
            <dl className="mt-3 divide-y divide-border border-y border-border">
              {crop.taxonomy.map((row) => (
                <div key={row.rank} className="flex items-baseline justify-between gap-4 py-2.5">
                  <dt className="readout text-[10px] uppercase text-muted-foreground">
                    {row.rank}
                  </dt>
                  <dd className="text-right text-sm italic">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="readout text-[10px] uppercase text-muted-foreground">
              Growing conditions
            </h2>
            <div className="mt-3 space-y-4">
              {crop.conditions.map((m) => (
                <div key={m.label}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm">{m.label}</span>
                    <span className="readout text-xs text-primary">{m.value}</span>
                  </div>
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
                      style={{ width: `${m.fill * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}