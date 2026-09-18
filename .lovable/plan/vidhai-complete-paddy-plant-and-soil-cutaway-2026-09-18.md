# VIDHAI — Complete Paddy Plant and Soil Cutaway

Upgrade the rice experience into one continuous, scientifically grounded specimen spanning mature panicles above ground through a visible fibrous root system below ground. Keep the existing crop shelf, crop switching, feeding data, and VR controls.

## What will change

### Complete paddy specimen
- Rebuild the rice clump as connected tillers emerging from a shared crown at the soil line.
- Use natural rice proportions: slender jointed culms, alternating narrow leaves with sheaths, flag leaves, and branched drooping panicles carrying individually oriented grains.
- Add subtle variation in leaf age, orientation, color, and surface response so the plant reads as a botanical specimen rather than repeated geometry.
- Keep wind motion restrained and anatomically plausible, with the crown and roots fixed while leaves and panicles move most at their tips.

### Underground root system
- Add a dense fibrous/adventitious rice root system growing continuously from the crown.
- Generate primary nodal roots with curved lateral branches, finer secondary roots, and selectively visible root-hair zones.
- Keep roots attached to the plant and naturally distributed through the soil volume; no floating or detached parts.

### Soil cross-section
- Replace the flat ground disc for rice with a cutaway soil monolith whose front and side faces reveal the root profile.
- Build visually distinct topsoil, saturated paddy soil, and lower subsoil layers with varied texture, moisture, pores, and small aggregate detail.
- Keep the soil partially open/transparent only where needed for inspection, while preserving realistic contact at the crown and readable roots.

### Scientific viewing and interaction
- Reframe the camera and orbit target to show the full plant from panicle tip to deepest root in one view, with zoom limits that support close inspection.
- Move the root hotspot to the actual underground root mass and preserve all existing hotspot-driven information panels.
- Brand the lab view as VIDHAI and add a concise specimen readout identifying the complete mature plant and root-zone depth.
- For rice, stop changing the plant into separate-looking growth objects: the specimen stays continuous. The lifecycle control may adjust maturity cues such as scale, color, panicle fill, and root extent without swapping or detaching anatomy.

## Technical details

- Extend the procedural rice geometry rather than introducing an external model dependency, because the current plant is already generated and must remain continuously connected and stage-aware.
- Add reusable spline/tube root generation with deterministic branching, instancing for fine roots/root hairs, and bounded geometry counts for mobile VR performance.
- Add procedural soil materials and geometry with no runtime CDN textures.
- Preserve the current React Three Fiber client-only boundary and all other crop implementations.
- Update the rice-specific scene composition, camera targets, lighting, shadows, and metadata without changing feeding editor behavior.

## Validation

- Verify desktop and mobile framing in the live preview.
- Confirm the mature rice model visibly includes connected culms, leaves, panicles, crown, primary roots, lateral roots, and soil layers.
- Test orbit, zoom, immersive mode, hotspots, lifecycle controls, and switching away from and back to rice.
- Check screenshots for clear lighting, no detached geometry, no panel overlap, and no browser console or missing-asset errors.
