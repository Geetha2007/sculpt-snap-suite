// Browser-safe crop data. Imported by both routes (SSR) and 3D scenes (client).

export type Hotspot = {
  id: string;
  label: string;
  /** world-space position on the plant model */
  position: [number, number, number];
  blurb: string;
};

export type LifecycleStage = {
  id: string;
  name: string;
  days: string;
  note: string;
  /** 0..1 growth driver for the procedural model */
  growth: number;
};

export type TaxonomyRow = { rank: string; value: string };

export type ConditionMetric = {
  label: string;
  value: string;
  /** 0..1 fill for the gauge */
  fill: number;
};

export type CellLayer = {
  id: string;
  name: string;
  color: string;
  note: string;
};

export type Crop = {
  slug: string;
  name: string;
  binomial: string;
  tagline: string;
  modeled: boolean;
  accent: string;
  summary: string;
  taxonomy: TaxonomyRow[];
  conditions: ConditionMetric[];
  cells: CellLayer[];
  lifecycle: LifecycleStage[];
  hotspots: Hotspot[];
};

const riceLifecycle: LifecycleStage[] = [
  { id: "germination", name: "Germination", days: "Day 0-10", growth: 0.12, note: "Seed imbibes water; coleoptile and radicle emerge in flooded nursery beds." },
  { id: "tillering", name: "Tillering", days: "Day 10-45", growth: 0.38, note: "Lateral shoots multiply from the base. Leaf area expands fastest here." },
  { id: "initiation", name: "Panicle initiation", days: "Day 45-70", growth: 0.62, note: "The growing point switches from leaves to the young panicle inside the culm." },
  { id: "flowering", name: "Flowering", days: "Day 70-95", growth: 0.84, note: "Panicles exsert and anthesis occurs, mostly self-pollinating within a few hours." },
  { id: "ripening", name: "Ripening", days: "Day 95-130", growth: 1, note: "Grains fill with starch, heads bend under weight and the canopy turns gold." },
];

export const CROPS: Crop[] = [
  {
    slug: "rice",
    name: "Paddy Rice",
    binomial: "Oryza sativa",
    tagline: "The flooded-field grass that feeds half the planet",
    modeled: true,
    accent: "primary",
    summary:
      "A semi-aquatic annual grass grown in standing water. Its hollow culms, aerenchyma-rich tissue and drooping panicles are adaptations to submerged, low-oxygen roots.",
    taxonomy: [
      { rank: "Kingdom", value: "Plantae" },
      { rank: "Clade", value: "Angiosperms / Monocots / Commelinids" },
      { rank: "Order", value: "Poales" },
      { rank: "Family", value: "Poaceae (true grasses)" },
      { rank: "Subfamily", value: "Oryzoideae" },
      { rank: "Genus", value: "Oryza" },
      { rank: "Species", value: "Oryza sativa L." },
      { rank: "Subspecies", value: "indica, japonica, aus, aromatic" },
      { rank: "Common names", value: "Paddy, dhan, arroz, nel, chawal" },
    ],
    conditions: [
      { label: "Temperature", value: "20-35 °C", fill: 0.78 },
      { label: "Standing water", value: "5-10 cm", fill: 0.55 },
      { label: "Soil pH", value: "5.5 - 6.5", fill: 0.6 },
      { label: "Sunlight", value: "6-8 h/day full sun", fill: 0.86 },
      { label: "Season length", value: "110-150 days", fill: 0.7 },
      { label: "Yield", value: "4-6 t/ha", fill: 0.52 },
      { label: "Rainfall", value: "1000-2000 mm", fill: 0.8 },
    ],
    cells: [
      { id: "epidermis", name: "Epidermis", color: "#9fe870", note: "Silica-rich outer layer with papillae that stiffen the blade and deter chewing insects." },
      { id: "bulliform", name: "Bulliform cells", color: "#d7f7a8", note: "Large thin-walled cells that lose turgor in drought and roll the leaf inward to cut water loss." },
      { id: "mesophyll", name: "Mesophyll", color: "#39a845", note: "Lobed chlorenchyma packed with chloroplasts; the primary site of C3 photosynthesis." },
      { id: "vascular", name: "Vascular bundle", color: "#f5c451", note: "Xylem and phloem in a bundle sheath, moving water up and sugars down the plant." },
      { id: "aerenchyma", name: "Aerenchyma", color: "#6fd2c2", note: "Air channels that pipe oxygen from the shoot to roots submerged in anaerobic paddy mud." },
    ],
    lifecycle: riceLifecycle,
    hotspots: [
      { id: "panicle", label: "Panicle", position: [0.55, 2.15, 0.25], blurb: "Branched flowering head carrying 80-150 spikelets. Bends over as grains fill." },
      { id: "blade", label: "Leaf blade", position: [-0.95, 1.35, 0.35], blurb: "Long lanceolate blade with a prominent midrib and a ligule at the sheath junction." },
      { id: "culm", label: "Culm", position: [0.12, 0.75, 0.3], blurb: "Hollow jointed stem. Internodes elongate rapidly to keep leaves above rising water." },
      { id: "roots", label: "Root zone", position: [0.05, 0.05, 0.45], blurb: "Shallow fibrous mat in saturated mud, ventilated internally by aerenchyma." },
    ],
  },
  {
    slug: "wheat",
    name: "Wheat",
    binomial: "Triticum aestivum",
    tagline: "Temperate grain with golden bearded spikes",
    modeled: true,
    accent: "grain",
    summary:
      "A cool-season grass with erect culms topped by a compact bearded spike. Four ranks of overlapping spikelets carry the grain, each tipped with a long awn that shades and photosynthesises for the filling kernel.",
    taxonomy: [
      { rank: "Kingdom", value: "Plantae" },
      { rank: "Clade", value: "Angiosperms / Monocots / Commelinids" },
      { rank: "Order", value: "Poales" },
      { rank: "Family", value: "Poaceae (true grasses)" },
      { rank: "Subfamily", value: "Pooideae" },
      { rank: "Genus", value: "Triticum" },
      { rank: "Species", value: "Triticum aestivum L." },
      { rank: "Types", value: "Winter, spring, hard red, soft white, durum" },
      { rank: "Common names", value: "Bread wheat, gehun, trigo, blé" },
    ],
    conditions: [
      { label: "Temperature", value: "12-25 °C", fill: 0.5 },
      { label: "Rainfall", value: "450-650 mm", fill: 0.42 },
      { label: "Soil pH", value: "6.0 - 7.5", fill: 0.68 },
      { label: "Sunlight", value: "7-9 h/day full sun", fill: 0.9 },
      { label: "Season length", value: "120-150 days", fill: 0.72 },
      { label: "Yield", value: "3-5 t/ha", fill: 0.46 },
    ],
    cells: [
      { id: "epidermis", name: "Epidermis", color: "#e8cf7a", note: "Waxy cuticle over silica cells; the bloom limits water loss on dryland soils." },
      { id: "bulliform", name: "Bulliform cells", color: "#f3e4ac", note: "Hinge cells that flex and roll the blade during midday drought stress." },
      { id: "mesophyll", name: "Mesophyll", color: "#4fa832", note: "Compact C3 chlorenchyma; the flag leaf supplies most of the grain's carbon." },
      { id: "vascular", name: "Vascular bundle", color: "#f5c451", note: "Large and small bundles alternate along the blade, feeding the filling spike." },
      { id: "sclerenchyma", name: "Sclerenchyma", color: "#9a8f5a", note: "Thick-walled fibre girders that keep the culm upright and resist lodging." },
    ],
    lifecycle: [
      { id: "germination", name: "Germination", days: "Day 0-10", growth: 0.12, note: "Seed imbibes water; the coleoptile pushes up through dry-sown soil." },
      { id: "tillering", name: "Tillering", days: "Day 10-45", growth: 0.36, note: "Side shoots form at the crown, setting the number of future spikes." },
      { id: "jointing", name: "Stem elongation", days: "Day 45-75", growth: 0.6, note: "Internodes extend, lifting the developing spike inside the boot." },
      { id: "heading", name: "Heading & anthesis", days: "Day 75-100", growth: 0.84, note: "The bearded spike emerges and anthers shed pollen; awns fan out." },
      { id: "ripening", name: "Ripening", days: "Day 100-140", growth: 1, note: "Kernels harden and the whole plant turns straw-gold, ready to harvest." },
    ],
    hotspots: [
      { id: "spike", label: "Spike", position: [0.35, 2.25, 0.2], blurb: "Bearded head with four ranks of spikelets; each carries 2-4 kernels." },
      { id: "awn", label: "Awns", position: [-0.5, 2.6, 0.15], blurb: "Long bristles that photosynthesise, cool the head and deter grazing birds." },
      { id: "flagleaf", label: "Flag leaf", position: [-0.9, 1.3, 0.3], blurb: "The uppermost blade — source of most of the sugars that fill the grain." },
      { id: "culm", label: "Culm", position: [0.15, 0.8, 0.3], blurb: "Hollow jointed stem stiffened with fibre bands so the heavy head stays upright." },
    ],
  },
  {
    slug: "maize",
    name: "Maize",
    binomial: "Zea mays",
    tagline: "C4 giant with broad blades and terminal tassels",
    modeled: false,
    accent: "grain",
    summary: "A tall C4 annual with separate male tassels and female ears, the most productive cereal per hectare.",
    taxonomy: [
      { rank: "Family", value: "Poaceae" },
      { rank: "Genus", value: "Zea" },
      { rank: "Species", value: "Zea mays L." },
    ],
    conditions: [
      { label: "Temperature", value: "18-32 °C", fill: 0.74 },
      { label: "Soil pH", value: "5.8 - 7.0", fill: 0.62 },
      { label: "Season length", value: "90-120 days", fill: 0.58 },
    ],
    cells: [],
    lifecycle: [],
    hotspots: [],
  },
  {
    slug: "soybean",
    name: "Soybean",
    binomial: "Glycine max",
    tagline: "Nitrogen-fixing legume with trifoliate leaves",
    modeled: false,
    accent: "leaf",
    summary: "A legume that partners with Bradyrhizobium in root nodules to fix atmospheric nitrogen.",
    taxonomy: [
      { rank: "Family", value: "Fabaceae" },
      { rank: "Genus", value: "Glycine" },
      { rank: "Species", value: "Glycine max (L.) Merr." },
    ],
    conditions: [
      { label: "Temperature", value: "20-30 °C", fill: 0.68 },
      { label: "Soil pH", value: "6.0 - 7.0", fill: 0.64 },
      { label: "Season length", value: "95-130 days", fill: 0.62 },
    ],
    cells: [],
    lifecycle: [],
    hotspots: [],
  },
  {
    slug: "sugarcane",
    name: "Sugarcane",
    binomial: "Saccharum officinarum",
    tagline: "Perennial cane storing sucrose in thick internodes",
    modeled: false,
    accent: "leaf",
    summary: "A tall perennial grass whose solid culms accumulate sucrose over a long 10-18 month cycle.",
    taxonomy: [
      { rank: "Family", value: "Poaceae" },
      { rank: "Genus", value: "Saccharum" },
      { rank: "Species", value: "Saccharum officinarum L." },
    ],
    conditions: [
      { label: "Temperature", value: "24-35 °C", fill: 0.85 },
      { label: "Soil pH", value: "6.0 - 7.5", fill: 0.66 },
      { label: "Season length", value: "300-540 days", fill: 0.95 },
    ],
    cells: [],
    lifecycle: [],
    hotspots: [],
  },
];

export function getCrop(slug: string): Crop | undefined {
  return CROPS.find((c) => c.slug === slug);
}

export const RICE = CROPS[0]!;