import * as THREE from "three";

import { makeRng } from "./paddy-model";

export type RiceRootSpec = {
  geometry: THREE.TubeGeometry;
  kind: "nodal" | "lateral";
};

export type RootHairField = {
  positions: Float32Array;
  colors: Float32Array;
};

function rootCurve(points: THREE.Vector3[], radius: number) {
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 18, radius, 5, false);
}

export function buildRiceRoots(growth: number, seed = 611) {
  const rng = makeRng(seed);
  const roots: RiceRootSpec[] = [];
  const hairPositions: number[] = [];
  const hairColors: number[] = [];
  const extent = 0.52 + growth * 0.58;
  const primaryCount = 16;

  for (let i = 0; i < primaryCount; i++) {
    const angle = (i / primaryCount) * Math.PI * 2 + (rng() - 0.5) * 0.35;
    const spread = 0.28 + rng() * 0.52;
    const depth = (0.58 + rng() * 0.62) * extent;
    const origin = new THREE.Vector3((rng() - 0.5) * 0.12, -0.015, (rng() - 0.5) * 0.12);
    const points = [
      origin,
      new THREE.Vector3(Math.cos(angle) * spread * 0.18, -depth * 0.2, Math.sin(angle) * spread * 0.18),
      new THREE.Vector3(Math.cos(angle) * spread * 0.58, -depth * 0.58, Math.sin(angle) * spread * 0.58),
      new THREE.Vector3(Math.cos(angle) * spread, -depth, Math.sin(angle) * spread),
    ];
    const curve = new THREE.CatmullRomCurve3(points);
    roots.push({ geometry: new THREE.TubeGeometry(curve, 24, 0.011 - rng() * 0.0025, 6, false), kind: "nodal" });

    for (let b = 1; b <= 3; b++) {
      const t = 0.2 + b * 0.2 + rng() * 0.08;
      const start = curve.getPoint(t);
      const side = angle + (rng() > 0.5 ? 1 : -1) * (0.55 + rng() * 0.65);
      const length = 0.16 + rng() * 0.24;
      const end = start.clone().add(new THREE.Vector3(Math.cos(side) * length, -length * (0.32 + rng() * 0.45), Math.sin(side) * length));
      const mid = start.clone().lerp(end, 0.5).add(new THREE.Vector3((rng() - 0.5) * 0.05, -0.025, (rng() - 0.5) * 0.05));
      roots.push({ geometry: rootCurve([start, mid, end], 0.0035), kind: "lateral" });

      for (let h = 0; h < 8; h++) {
        const ht = 0.2 + (h / 8) * 0.75;
        const p = new THREE.QuadraticBezierCurve3(start, mid, end).getPoint(ht);
        const hairLength = 0.018 + rng() * 0.025;
        const hairAngle = rng() * Math.PI * 2;
        hairPositions.push(p.x, p.y, p.z);
        hairPositions.push(
          p.x + Math.cos(hairAngle) * hairLength,
          p.y + (rng() - 0.5) * hairLength,
          p.z + Math.sin(hairAngle) * hairLength,
        );
        hairColors.push(0.72, 0.62, 0.43, 0.46, 0.35, 0.2);
      }
    }
  }

  return {
    roots,
    hairs: {
      positions: new Float32Array(hairPositions),
      colors: new Float32Array(hairColors),
    } satisfies RootHairField,
  };
}
