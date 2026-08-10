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
    modeled: true,
    accent: "grain",
    summary:
      "A tall C4 annual with a jointed solid stalk, broad arching blades and separate flowers: a feathery male tassel on top and female ears wrapped in husks with silks lower down.",
    taxonomy: [
      { rank: "Kingdom", value: "Plantae" },
      { rank: "Clade", value: "Angiosperms / Monocots / Commelinids" },
      { rank: "Order", value: "Poales" },
      { rank: "Family", value: "Poaceae (true grasses)" },
      { rank: "Subfamily", value: "Panicoideae" },
      { rank: "Genus", value: "Zea" },
      { rank: "Species", value: "Zea mays L." },
      { rank: "Types", value: "Dent, flint, sweet, popcorn, waxy" },
      { rank: "Common names", value: "Corn, makka, maíz, bhutta" },
    ],
    conditions: [
      { label: "Temperature", value: "18-32 °C", fill: 0.74 },
      { label: "Rainfall", value: "500-800 mm", fill: 0.55 },
      { label: "Soil pH", value: "5.8 - 7.0", fill: 0.62 },
      { label: "Sunlight", value: "8-10 h/day full sun", fill: 0.95 },
      { label: "Season length", value: "90-120 days", fill: 0.58 },
      { label: "Yield", value: "8-12 t/ha", fill: 0.88 },
    ],
    cells: [
      { id: "epidermis", name: "Epidermis", color: "#c9e26a", note: "Waxy cuticle with paired guard cells and dumbbell stomata typical of grasses." },
      { id: "bundlesheath", name: "Bundle sheath", color: "#f2c531", note: "Ring of thick chloroplast-rich cells where C4 carbon is released and fixed by Rubisco." },
      { id: "mesophyll", name: "Mesophyll", color: "#4fa832", note: "Outer ring that fixes CO2 into malate — the first half of the C4 pump." },
      { id: "vascular", name: "Vascular bundle", color: "#f5c451", note: "Kranz anatomy: xylem and phloem wrapped by the bundle sheath in a wreath." },
      { id: "pith", name: "Pith parenchyma", color: "#dfe8b0", note: "Spongy sugar-storing core that keeps the solid stalk light but stiff." },
    ],
    lifecycle: [
      { id: "ve", name: "Emergence (VE)", days: "Day 0-10", growth: 0.12, note: "Coleoptile breaks the surface; the growing point stays below ground." },
      { id: "v6", name: "Vegetative (V6-V10)", days: "Day 10-40", growth: 0.42, note: "Rapid leaf and stalk growth; ear shoots and kernel rows are set." },
      { id: "vt", name: "Tasseling (VT)", days: "Day 40-60", growth: 0.68, note: "The tassel emerges and sheds pollen onto freshly exposed silks." },
      { id: "r3", name: "Milk stage (R3)", days: "Day 60-85", growth: 0.86, note: "Kernels fill with milky starch; the ear reaches full length." },
      { id: "r6", name: "Maturity (R6)", days: "Day 85-120", growth: 1, note: "Black layer forms at the kernel base; husks dry and the plant senesces." },
    ],
    hotspots: [
      { id: "tassel", label: "Tassel", position: [0.15, 2.35, 0.2], blurb: "Male inflorescence releasing millions of pollen grains over about a week." },
      { id: "ear", label: "Ear & silk", position: [0.55, 1.3, 0.3], blurb: "Female inflorescence; each silk is a style leading to one kernel." },
      { id: "stalk", label: "Stalk", position: [0.1, 0.85, 0.35], blurb: "Solid jointed culm with sugar-rich pith and a node at every leaf." },
      { id: "brace", label: "Brace roots", position: [0.05, 0.12, 0.45], blurb: "Aerial roots from the lower nodes that anchor the tall plant against lodging." },
    ],
  },
  {
    slug: "soybean",
    name: "Soybean",
    binomial: "Glycine max",
    tagline: "Nitrogen-fixing legume with trifoliate leaves",
    modeled: true,
    accent: "leaf",
    summary:
      "An erect bushy legume with three-leaflet leaves, small purple or white flowers and hairy pods holding two to four beans. Root nodules host Bradyrhizobium that fix atmospheric nitrogen.",
    taxonomy: [
      { rank: "Kingdom", value: "Plantae" },
      { rank: "Clade", value: "Angiosperms / Eudicots / Rosids" },
      { rank: "Order", value: "Fabales" },
      { rank: "Family", value: "Fabaceae (legumes)" },
      { rank: "Subfamily", value: "Faboideae" },
      { rank: "Genus", value: "Glycine" },
      { rank: "Species", value: "Glycine max (L.) Merr." },
      { rank: "Types", value: "Determinate, indeterminate, vegetable (edamame)" },
      { rank: "Common names", value: "Soya bean, soja, daizu" },
    ],
    conditions: [
      { label: "Temperature", value: "20-30 °C", fill: 0.68 },
      { label: "Rainfall", value: "450-700 mm", fill: 0.48 },
      { label: "Soil pH", value: "6.0 - 7.0", fill: 0.64 },
      { label: "Sunlight", value: "7-9 h/day full sun", fill: 0.88 },
      { label: "Season length", value: "95-130 days", fill: 0.62 },
      { label: "Yield", value: "2.5-4 t/ha", fill: 0.4 },
    ],
    cells: [
      { id: "epidermis", name: "Epidermis", color: "#9fe870", note: "Hairy (pubescent) surface that slows water loss and deters small insects." },
      { id: "palisade", name: "Palisade mesophyll", color: "#2f7d2a", note: "Column cells packed with chloroplasts — the dicot leaf's main light trap." },
      { id: "spongy", name: "Spongy mesophyll", color: "#6fd2c2", note: "Loose cells with air spaces that let CO2 diffuse to every chloroplast." },
      { id: "vascular", name: "Vein bundle", color: "#f5c451", note: "Netted venation typical of dicots, unlike the parallel veins of grasses." },
      { id: "nodule", name: "Root nodule tissue", color: "#d8749a", note: "Leghemoglobin-pink cells housing rhizobia that convert N2 into ammonia." },
    ],
    lifecycle: [
      { id: "ve", name: "Emergence (VE)", days: "Day 0-10", growth: 0.12, note: "Hypocotyl arches up and pulls the two cotyledons above the soil." },
      { id: "v3", name: "Vegetative (V3-V6)", days: "Day 10-35", growth: 0.4, note: "Trifoliate leaves stack up; nodules form and nitrogen fixation begins." },
      { id: "r1", name: "Flowering (R1-R2)", days: "Day 35-60", growth: 0.62, note: "Purple or white self-pollinating flowers open at the nodes." },
      { id: "r4", name: "Pod fill (R4-R5)", days: "Day 60-95", growth: 0.85, note: "Pods elongate and seeds swell, drawing on leaf sugars and fixed nitrogen." },
      { id: "r8", name: "Maturity (R8)", days: "Day 95-130", growth: 1, note: "Leaves drop, pods turn tan and the beans harden to harvest moisture." },
    ],
    hotspots: [
      { id: "trifoliate", label: "Trifoliate leaf", position: [0.75, 1.5, 0.25], blurb: "Three leaflets on one petiole that track the sun through the day." },
      { id: "flower", label: "Flower", position: [-0.45, 1.65, 0.3], blurb: "Small papilionaceous flower; self-pollinates before it even opens." },
      { id: "pod", label: "Pod", position: [0.5, 0.95, 0.35], blurb: "Hairy pod holding two to four beans rich in protein and oil." },
      { id: "nodule", label: "Root nodules", position: [0.05, 0.05, 0.45], blurb: "Rhizobium-filled nodules fixing up to 200 kg of nitrogen per hectare." },
    ],
  },
  {
    slug: "sugarcane",
    name: "Sugarcane",
    binomial: "Saccharum officinarum",
    tagline: "Perennial cane storing sucrose in thick internodes",
    modeled: true,
    accent: "leaf",
    summary:
      "A tall perennial grass that grows in dense stools of jointed canes. Solid internodes accumulate sucrose over a 10-18 month cycle while a fan of long blades feeds the store.",
    taxonomy: [
      { rank: "Kingdom", value: "Plantae" },
      { rank: "Clade", value: "Angiosperms / Monocots / Commelinids" },
      { rank: "Order", value: "Poales" },
      { rank: "Family", value: "Poaceae (true grasses)" },
      { rank: "Subfamily", value: "Panicoideae" },
      { rank: "Genus", value: "Saccharum" },
      { rank: "Species", value: "Saccharum officinarum L." },
      { rank: "Types", value: "Noble canes, commercial interspecific hybrids" },
      { rank: "Common names", value: "Cane, ganna, caña de azúcar" },
    ],
    conditions: [
      { label: "Temperature", value: "24-35 °C", fill: 0.85 },
      { label: "Rainfall", value: "1500-2500 mm", fill: 0.92 },
      { label: "Soil pH", value: "6.0 - 7.5", fill: 0.66 },
      { label: "Sunlight", value: "8-10 h/day full sun", fill: 0.94 },
      { label: "Season length", value: "300-540 days", fill: 0.95 },
      { label: "Yield", value: "70-100 t/ha cane", fill: 0.9 },
    ],
    cells: [
      { id: "rind", name: "Rind (epidermis)", color: "#9bb741", note: "Hard silica-reinforced skin with a waxy bloom that protects the sugar store." },
      { id: "storage", name: "Storage parenchyma", color: "#e8e0a2", note: "Large thin-walled cells whose vacuoles hold sucrose at up to 20% of fresh weight." },
      { id: "fiber", name: "Fibrovascular bundle", color: "#b6803a", note: "Scattered bundles of xylem, phloem and fibre — the bagasse left after crushing." },
      { id: "mesophyll", name: "Leaf mesophyll", color: "#4fa832", note: "C4 chlorenchyma in Kranz rings, one of the most efficient sugar factories in nature." },
      { id: "bud", name: "Axillary bud", color: "#6fd2c2", note: "A dormant eye at every node; planted setts sprout new canes from these buds." },
    ],
    lifecycle: [
      { id: "germination", name: "Sett germination", days: "Day 0-45", growth: 0.12, note: "Buds on planted stem cuttings sprout and set their own roots." },
      { id: "tillering", name: "Tillering", days: "Day 45-120", growth: 0.35, note: "The stool fills out as side shoots multiply from the base." },
      { id: "grand", name: "Grand growth", days: "Day 120-270", growth: 0.68, note: "Internodes elongate fastest here — up to 4 cm a day in warm wet weather." },
      { id: "ripening", name: "Ripening", days: "Day 270-420", growth: 0.9, note: "Growth slows and sucrose piles up from the base of the cane upward." },
      { id: "arrowing", name: "Maturity / arrowing", days: "Day 420-540", growth: 1, note: "Canes may throw a silvery flowering arrow; sugar peaks just before harvest." },
    ],
    hotspots: [
      { id: "cane", label: "Cane", position: [0.45, 1.35, 0.3], blurb: "Solid jointed stalk — the harvested organ, crushed for juice." },
      { id: "internode", label: "Internode & node", position: [-0.4, 0.85, 0.3], blurb: "Sucrose fills the internode; each node carries a bud and a root band." },
      { id: "fan", label: "Leaf fan", position: [0.2, 2.35, 0.25], blurb: "Long arching blades at the top run C4 photosynthesis all season." },
      { id: "stool", label: "Stool & roots", position: [0.05, 0.08, 0.5], blurb: "The clump of canes and fibrous roots that regrows as a ratoon after cutting." },
    ],
  },
];

export function getCrop(slug: string): Crop | undefined {
  return CROPS.find((c) => c.slug === slug);
}

export const RICE = CROPS[0]!;
/** Stage-by-stage feeding (nutrition + water) schedule for a crop. */
export type FeedStep = {
  /** matches a LifecycleStage id */
  stageId: string;
  stage: string;
  water: string;
  nutrients: string;
  dose: string;
  tip: string;
};

export const FEEDING: Record<string, FeedStep[]> = {
  rice: [
    { stageId: "germination", stage: "Germination", water: "Saturated, 2-3 cm film", nutrients: "Basal N-P-K + Zn", dose: "40 kg N, 60 kg P₂O₅, 40 kg K₂O /ha", tip: "Incorporate the basal dose into puddled mud before transplanting." },
    { stageId: "tillering", stage: "Tillering", water: "5 cm standing water", nutrients: "First N top-dress", dose: "30 kg N /ha as urea", tip: "Drain shallowly before broadcasting urea, then re-flood within a day." },
    { stageId: "initiation", stage: "Panicle initiation", water: "5-7 cm standing water", nutrients: "Second N + K", dose: "30 kg N, 20 kg K₂O /ha", tip: "The most yield-sensitive dose — it sets spikelet number per panicle." },
    { stageId: "flowering", stage: "Flowering", water: "Keep 5 cm, never dry", nutrients: "Foliar K / micronutrients", dose: "2% KCl spray if leaves pale", tip: "Water stress at anthesis causes the highest sterility of the whole season." },
    { stageId: "ripening", stage: "Ripening", water: "Drain 10-14 days before harvest", nutrients: "None", dose: "—", tip: "Late nitrogen delays maturity and invites lodging and neck blast." },
  ],
  wheat: [
    { stageId: "germination", stage: "Germination", water: "Pre-sow irrigation (CRI at day 21)", nutrients: "Basal N-P-K", dose: "60 kg N, 60 kg P₂O₅, 40 kg K₂O /ha", tip: "The crown-root irrigation is the single most critical watering for wheat." },
    { stageId: "tillering", stage: "Tillering", water: "Irrigate day 40-45", nutrients: "First N top-dress", dose: "40 kg N /ha", tip: "Feed with the irrigation so nitrogen moves into the crown root zone." },
    { stageId: "jointing", stage: "Stem elongation", water: "Irrigate day 65-70", nutrients: "Second N + S", dose: "30 kg N, 20 kg S /ha", tip: "Sulphur here lifts grain protein and baking quality." },
    { stageId: "heading", stage: "Heading & anthesis", water: "Irrigate at flowering", nutrients: "Foliar micronutrients", dose: "0.5% ZnSO₄ + 2% urea spray", tip: "Avoid heavy nitrogen now — it delays ripening and softens the straw." },
    { stageId: "ripening", stage: "Ripening", water: "One light dough-stage irrigation", nutrients: "None", dose: "—", tip: "Stop water 10-12 days before harvest so kernels harden evenly." },
  ],
  maize: [
    { stageId: "ve", stage: "Emergence (VE)", water: "Moist seedbed, light irrigation", nutrients: "Starter N-P + Zn", dose: "40 kg N, 60 kg P₂O₅, 25 kg ZnSO₄ /ha", tip: "Band the starter 5 cm beside and below the seed, never on it." },
    { stageId: "v6", stage: "Vegetative (V6-V10)", water: "25-35 mm per week", nutrients: "Main N side-dress + K", dose: "60 kg N, 40 kg K₂O /ha", tip: "V6-V8 is peak demand; late side-dressing cannot recover lost kernel rows." },
    { stageId: "vt", stage: "Tasseling (VT)", water: "No stress — 40 mm per week", nutrients: "Final N split", dose: "30 kg N /ha", tip: "Drought during silking is the biggest single yield killer in maize." },
    { stageId: "r3", stage: "Milk stage (R3)", water: "Steady moisture", nutrients: "Foliar K / B if deficient", dose: "1% KNO₃ spray", tip: "Keep the ear leaf green — it supplies most of the kernel's starch." },
    { stageId: "r6", stage: "Maturity (R6)", water: "Taper off", nutrients: "None", dose: "—", tip: "Stop irrigating once the black layer forms; extra water only slows drydown." },
  ],
  soybean: [
    { stageId: "ve", stage: "Emergence (VE)", water: "Moist, well-drained seedbed", nutrients: "Rhizobium inoculant + starter P", dose: "Seed inoculation, 60 kg P₂O₅ /ha", tip: "Inoculate every seed lot — fixation, not fertiliser, supplies most nitrogen." },
    { stageId: "v3", stage: "Vegetative (V3-V6)", water: "20-25 mm per week", nutrients: "P-K + Mo, minimal N", dose: "40 kg K₂O /ha, 0.5 kg Mo /ha", tip: "Heavy nitrogen now shuts down nodulation — keep it low on purpose." },
    { stageId: "r1", stage: "Flowering (R1-R2)", water: "30 mm per week", nutrients: "Sulphur + boron", dose: "20 kg S, 1 kg B /ha", tip: "Boron reduces flower abortion and improves pod set." },
    { stageId: "r4", stage: "Pod fill (R4-R5)", water: "Peak demand, 35-40 mm per week", nutrients: "Foliar N-P-K rescue", dose: "2% urea + 1% KNO₃ spray", tip: "Pod fill is when irrigation pays back most; drought here shrinks seed size." },
    { stageId: "r8", stage: "Maturity (R8)", water: "Dry down", nutrients: "None", dose: "—", tip: "Withhold water at leaf drop to keep pods from shattering unevenly." },
  ],
  sugarcane: [
    { stageId: "germination", stage: "Sett germination", water: "Light irrigation every 7-10 days", nutrients: "Basal P-K + N starter", dose: "50 kg N, 80 kg P₂O₅, 60 kg K₂O /ha", tip: "Keep setts moist but never waterlogged or the buds rot before sprouting." },
    { stageId: "tillering", stage: "Tillering", water: "Irrigate every 10 days", nutrients: "First N split + earthing up", dose: "80 kg N /ha", tip: "Feed and earth up together so new tillers root into fertilised soil." },
    { stageId: "grand", stage: "Grand growth", water: "Heaviest demand — every 7 days", nutrients: "Second N + K, Fe/Zn foliar", dose: "120 kg N, 60 kg K₂O /ha", tip: "70% of the season's water and nitrogen is used in this phase alone." },
    { stageId: "ripening", stage: "Ripening", water: "Stretch intervals to 20 days", nutrients: "Stop nitrogen", dose: "—", tip: "Mild moisture stress now pushes sucrose accumulation up the cane." },
    { stageId: "arrowing", stage: "Maturity / arrowing", water: "Withhold 3-4 weeks pre-harvest", nutrients: "None", dose: "—", tip: "Late nitrogen or water keeps the cane green and cuts recoverable sugar." },
  ],
};

export function getFeeding(slug: string): FeedStep[] {
  return FEEDING[slug] ?? [];
}
