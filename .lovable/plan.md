# 3D Agriculture Lab — Interactive Paddy (Rice) Crop Explorer

Build a full immersive "lab" experience around a 3D rice/paddy plant, matching the reference photo: bright green blade-like leaves fanning outward with drooping grain panicles, floating in deep near-black space.

## What gets built

**Home (`/`) — the Lab**
- Full-viewport 3D stage with the paddy plant centered, slow auto-rotation, orbit/zoom/pan with the mouse, and drag-to-look free camera movement.
- Cinematic dark environment: subtle glow, soft ground reflection, drifting dust motes, gentle idle sway on the leaves as if in wind.
- Immersive (VR-style) mode toggle: hides all UI chrome and pushes the camera into a first-person "stand next to the plant" view with head-look on pointer movement. Includes an "Enter VR" button that activates on WebXR headsets and hides gracefully when unsupported.
- Hotspot markers pinned to plant parts (panicle/grain head, leaf blade, culm/stem, root zone). Clicking a hotspot flies the camera in and opens its detail panel.

**Lab panels (side dock, opened from hotspots or the left rail)**
- Taxonomy — kingdom through species for *Oryza sativa*, with common names and cultivar notes.
- Growing conditions — temperature range, water depth, soil pH, sunlight, season length, yield; shown as labeled gauges/bars.
- Cellular structure — a second 3D inset showing a stylized leaf cross-section (epidermis, mesophyll, vascular bundle, bulliform cells) that rotates independently.
- Lifecycle — germination → tillering → panicle initiation → flowering → ripening, as a scrubbable timeline that morphs the main model's height, leaf count, and grain droop.

**Crops (`/crops`)** — cinematic "movie-style" browser: full-bleed cards for rice, wheat, maize, soybean, sugarcane. Rice is the fully modeled entry; the others open a placeholder detail state so the shelf is honest about what's modeled.

**Crop detail (`/crops/$slug`)** — routes back into the lab focused on that crop.

## 3D model approach

The plant is generated procedurally in code (no external model file), tuned to the reference photo:
- 30–40 curved leaf blades from tapered ribbons, bending outward and drooping at the tips, with a bright-to-deep green gradient.
- 6–10 panicles: thin arcing stems carrying clustered grain instances that droop more as the lifecycle advances.
- Vertex-shader wind sway so the whole clump breathes.
- Dark backdrop with rim lighting so the silhouette reads like the reference.

Your paddy photo is used as a faint backdrop billboard in the environment and as the crop card image — not as the model itself.

## Design direction

Dark laboratory: near-black background, chlorophyll-green primary with a lighter phosphor-green glow accent, warm amber for grain data. Thin mono type for readouts, a clean geometric sans for headings. Glass-panel dock with hairline borders.

## Technical notes

- Three.js + @react-three/fiber + @react-three/drei, plus `motion` for panel transitions.
- All 3D is client-only: scene components load via `React.lazy` behind `<ClientOnly>` so SSR never evaluates Three.js. Shared crop data lives in a browser-safe module imported by both routes and scenes.
- Routes: `src/routes/index.tsx` (the lab, replacing the placeholder), `crops.index.tsx`, `crops.$slug.tsx`, each with its own head() metadata.
- Design tokens added to `src/styles.css`; no hardcoded color utilities.
- No backend — crop data is static in the repo.