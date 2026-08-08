import * as THREE from "three";

import { makeRng } from "./paddy-model";

const TIP = new THREE.Color("#8fd14a");
const MID = new THREE.Color("#4fa832");
const BASE = new THREE.Color("#20661f");

/** Upright, gently arching wheat leaf blade. */
export function wheatBladeGeometry(length: number, width: number, curl: number) {
  const SEG = 22;
  const positions: number[] = [];
  const colors: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const c = new THREE.Color();

  for (let i = 0; i <= SEG; i++) {
    const t = i / SEG;
    const y = length * (t * (1 - 0.12 * t));
    const z = curl * length * t * t * 0.6;
    const droop = -curl * length * Math.pow(t, 3) * 0.55;
    const w = width * Math.sin(Math.min(1, t * 2.6) * Math.PI * 0.5) * (1 - Math.pow(t, 2) * 0.92);

    if (t < 0.5) c.copy(BASE).lerp(MID, t / 0.5);
    else c.copy(MID).lerp(TIP, (t - 0.5) / 0.5);

    positions.push(-w, y + droop, z - w * 0.3);
    positions.push(w, y + droop, z - w * 0.3);
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

export type WheatBlade = {
  geometry: THREE.BufferGeometry;
  yaw: number;
  tilt: number;
  phase: number;
  amplitude: number;
  offset: [number, number, number];
};

export function buildWheatBlades(count: number, growth: number, seed = 17): WheatBlade[] {
  const rng = makeRng(seed);
  const out: WheatBlade[] = [];
  for (let i = 0; i < count; i++) {
    const r = rng();
    const length = (1.3 + r * 1.2) * (0.35 + 0.65 * growth);
    out.push({
      geometry: wheatBladeGeometry(length, 0.03 + r * 0.016, 0.1 + rng() * 0.35),
      yaw: rng() * Math.PI * 2,
      tilt: (rng() - 0.5) * 0.22,
      phase: rng() * Math.PI * 2,
      amplitude: 0.015 + rng() * 0.035,
      offset: [(rng() - 0.5) * 0.5, 0, (rng() - 0.5) * 0.5],
    });
  }
  return out;
}

export type Spikelet = { pos: THREE.Vector3; scale: number; yaw: number; pitch: number };
export type Awn = { geometry: THREE.BufferGeometry };

export type WheatSpike = {
  /** culm (stem) below the head */
  culm: THREE.TubeGeometry;
  /** head base height */
  headY: number;
  headLength: number;
  spikelets: Spikelet[];
  awns: THREE.BufferGeometry[];
  x: number;
  z: number;
  yaw: number;
  phase: number;
};

/**
 * A wheat ear: a near-vertical culm topped by a compact head of overlapping
 * golden spikelets in four vertical ranks, with long straight awns fanning up.
 */
export function buildWheatSpikes(count: number, growth: number, seed = 5): WheatSpike[] {
  const rng = makeRng(seed);
  const out: WheatSpike[] = [];
  const ripeness = Math.max(0, (growth - 0.4) / 0.6);

  for (let i = 0; i < count; i++) {
    const h = (1.7 + rng() * 0.75) * (0.4 + 0.6 * growth);
    const lean = (rng() - 0.5) * 0.34;
    const bend = 0.06 + ripeness * 0.14;
    const pts: THREE.Vector3[] = [];
    for (let s = 0; s <= 10; s++) {
      const t = s / 10;
      pts.push(new THREE.Vector3(lean * h * t * t * 0.5, h * t, bend * h * t * t));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const culm = new THREE.TubeGeometry(curve, 24, 0.011, 6, false);
    const top = curve.getPoint(1);

    const headLength = (0.42 + rng() * 0.16) * (0.5 + 0.5 * growth);
    const rows = Math.max(6, Math.round(headLength / 0.052));
    const spikelets: Spikelet[] = [];
    const awns: THREE.BufferGeometry[] = [];

    for (let r = 0; r < rows; r++) {
      const t = r / (rows - 1);
      const y = top.y + t * headLength;
      const taper = 0.85 + 0.35 * Math.sin(t * Math.PI) - t * 0.35;
      for (let k = 0; k < 4; k++) {
        const a = (k / 4) * Math.PI * 2 + r * 0.55;
        const rad = 0.032 * taper;
        spikelets.push({
          pos: new THREE.Vector3(
            top.x + Math.cos(a) * rad + bend * 0.1 * t,
            y,
            top.z + Math.sin(a) * rad,
          ),
          scale: taper * (0.85 + ripeness * 0.35),
          yaw: a,
          pitch: 0.35,
        });

        // long awn bristle from the upper half of each rank
        if (r > rows * 0.25 && k % 2 === 0) {
          const start = new THREE.Vector3(
            top.x + Math.cos(a) * rad * 1.2,
            y + 0.02,
            top.z + Math.sin(a) * rad * 1.2,
          );
          const len = 0.22 + rng() * 0.2;
          const end = start
            .clone()
            .add(new THREE.Vector3(Math.cos(a) * len * 0.35, len, Math.sin(a) * len * 0.35));
          awns.push(new THREE.BufferGeometry().setFromPoints([start, end]));
        }
      }
    }

    out.push({
      culm,
      headY: top.y,
      headLength,
      spikelets,
      awns,
      x: (rng() - 0.5) * 0.75,
      z: (rng() - 0.5) * 0.6,
      yaw: rng() * Math.PI * 2,
      phase: rng() * 6.28,
    });
  }
  return out;
}
