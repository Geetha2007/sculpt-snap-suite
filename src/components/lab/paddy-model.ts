import * as THREE from "three";

/** Deterministic pseudo-random so the plant is stable across renders. */
export function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const TIP = new THREE.Color("#a6f04f");
const MID = new THREE.Color("#4fc23a");
const BASE = new THREE.Color("#186b2b");

/**
 * A single rice leaf blade: a tapered ribbon that arcs outward from the base
 * and droops at the tip, matching the fanned silhouette of a paddy clump.
 */
export function bladeGeometry(length: number, width: number, curl: number) {
  const SEG = 26;
  const positions: number[] = [];
  const colors: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const c = new THREE.Color();

  for (let i = 0; i <= SEG; i++) {
    const t = i / SEG;
    const y = length * (t * (1 - 0.22 * t));
    const z = curl * length * t * t * 0.85;
    const droop = -curl * curl * length * Math.pow(t, 3.2) * 0.9;
    const w =
      width *
      Math.sin(Math.min(1, t * 3.4) * Math.PI * 0.5) *
      (1 - Math.pow(t, 1.7) * 0.98);

    if (t < 0.5) c.copy(BASE).lerp(MID, t / 0.5);
    else c.copy(MID).lerp(TIP, (t - 0.5) / 0.5);

    // slight midrib fold: edges sit a touch behind the centre
    positions.push(-w, y + droop, z - w * 0.35);
    positions.push(w, y + droop, z - w * 0.35);
    colors.push(c.r, c.g, c.b, c.r, c.g, c.b);
    uvs.push(0, t, 1, t);

    if (i < SEG) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

export type BladeSpec = {
  geometry: THREE.BufferGeometry;
  yaw: number;
  tilt: number;
  phase: number;
  amplitude: number;
  offset: [number, number, number];
};

export function buildBlades(count: number, growth: number, seed = 7): BladeSpec[] {
  const rng = makeRng(seed);
  const out: BladeSpec[] = [];
  for (let i = 0; i < count; i++) {
    const r = rng();
    const outer = i / count;
    const length = (1.15 + r * 1.35) * (0.35 + 0.65 * growth);
    const width = 0.019 + r * 0.016;
    const curl = 0.12 + rng() * 0.5 + outer * 0.4;
    out.push({
      geometry: bladeGeometry(length, width, curl),
      yaw: rng() * Math.PI * 2,
      tilt: (rng() - 0.5) * 0.34,
      phase: rng() * Math.PI * 2,
      amplitude: 0.02 + rng() * 0.05,
      offset: [(rng() - 0.5) * 0.14, 0, (rng() - 0.5) * 0.14],
    });
  }
  return out;
}

export type PanicleSpec = {
  stem: THREE.TubeGeometry;
  grains: { pos: THREE.Vector3; scale: number; rot: number }[];
  yaw: number;
  phase: number;
};

/** Arcing flower stalk carrying clustered grains; droop scales with ripeness. */
export function buildPanicles(count: number, growth: number, seed = 23): PanicleSpec[] {
  const rng = makeRng(seed);
  const out: PanicleSpec[] = [];
  const ripeness = Math.max(0, (growth - 0.45) / 0.55);

  for (let i = 0; i < count; i++) {
    const h = (1.5 + rng() * 0.85) * (0.4 + 0.6 * growth);
    const lean = 0.25 + rng() * 0.35;
    const droop = 0.35 + ripeness * 0.95;
    const pts: THREE.Vector3[] = [];
    for (let s = 0; s <= 10; s++) {
      const t = s / 10;
      pts.push(
        new THREE.Vector3(
          lean * h * t * t * 0.55,
          h * t - droop * h * 0.22 * Math.pow(t, 3),
          lean * h * t * t,
        ),
      );
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const stem = new THREE.TubeGeometry(curve, 32, 0.007, 5, false);

    const grains: { pos: THREE.Vector3; scale: number; rot: number }[] = [];
    const branchCount = 5 + Math.floor(rng() * 4);
    for (let b = 0; b < branchCount; b++) {
      const bt = 0.42 + (b / branchCount) * 0.56;
      const origin = curve.getPoint(bt);
      const dir = new THREE.Vector3(
        Math.cos(b * 2.4) * 0.14,
        -0.05 - ripeness * 0.16,
        Math.sin(b * 2.4) * 0.14,
      );
      const per = 4 + Math.floor(rng() * 4);
      for (let g = 0; g < per; g++) {
        const gt = (g + 1) / per;
        grains.push({
          pos: origin
            .clone()
            .add(dir.clone().multiplyScalar(gt))
            .add(
              new THREE.Vector3(
                (rng() - 0.5) * 0.03,
                -gt * 0.05 * ripeness,
                (rng() - 0.5) * 0.03,
              ),
            ),
          scale: 0.55 + rng() * 0.5 + ripeness * 0.35,
          rot: rng() * Math.PI,
        });
      }
    }

    out.push({ stem, grains, yaw: (i / count) * Math.PI * 2 + rng() * 0.7, phase: rng() * 6.28 });
  }
  return out;
}