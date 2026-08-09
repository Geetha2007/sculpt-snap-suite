import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { makeRng } from "./paddy-model";

/** Flat ovate leaflet built as a lens-shaped ribbon. */
function leafletGeometry(len: number, wid: number) {
  const SEG = 16;
  const pos: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= SEG; i++) {
    const t = i / SEG;
    const w = wid * Math.sin(t * Math.PI) ** 0.75;
    const droop = -0.12 * len * t * t;
    pos.push(-w, droop, t * len, w, droop, t * len);
    if (i < SEG) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function Trifoliate({ y, yaw, scale }: { y: number; yaw: number; scale: number }) {
  const geo = useMemo(() => leafletGeometry(0.42, 0.19), []);
  const petiole = useMemo(
    () =>
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0.05, 0.09, 0.12),
          new THREE.Vector3(0.08, 0.12, 0.26),
        ]),
        12,
        0.008,
        6,
        false,
      ),
    [],
  );

  return (
    <group position={[0, y, 0]} rotation={[0, yaw, 0]} scale={scale}>
      <mesh geometry={petiole}>
        <meshStandardMaterial color="#3f8a2c" roughness={0.7} />
      </mesh>
      <group position={[0.08, 0.12, 0.26]}>
        {[-0.85, 0, 0.85].map((a, i) => (
          <mesh key={i} geometry={geo} rotation={[-0.25, a, 0]}>
            <meshStandardMaterial
              color="#2f7d2a"
              side={THREE.DoubleSide}
              roughness={0.55}
              emissive="#0f2f10"
              emissiveIntensity={0.4}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Pod({ y, yaw, growth }: { y: number; yaw: number; growth: number }) {
  const beads = [0, 1, 2];
  return (
    <group position={[0, y, 0]} rotation={[0, yaw, -0.55]}>
      <mesh position={[0.13, -0.03, 0]} rotation={[0, 0, 1.35]} scale={[1, 0.5 + 0.5 * growth, 1]}>
        <capsuleGeometry args={[0.028, 0.2, 4, 10]} />
        <meshStandardMaterial color="#8bbd4f" roughness={0.6} emissive="#2b3d0f" emissiveIntensity={0.3} />
      </mesh>
      {beads.map((b) => (
        <mesh key={b} position={[0.07 + b * 0.06, -0.03, 0.001]} scale={0.5 + 0.5 * growth}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#cfe08a" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function Flowers({ height }: { height: number }) {
  const spots = useMemo(() => {
    const rng = makeRng(41);
    return Array.from({ length: 7 }, () => ({
      y: height * (0.5 + rng() * 0.45),
      yaw: rng() * Math.PI * 2,
      r: 0.07 + rng() * 0.05,
    }));
  }, [height]);
  return (
    <group>
      {spots.map((s, i) => (
        <mesh key={i} position={[Math.cos(s.yaw) * s.r, s.y, Math.sin(s.yaw) * s.r]}>
          <sphereGeometry args={[0.028, 8, 8]} />
          <meshStandardMaterial color="#8b4fd6" roughness={0.4} emissive="#3a1466" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function Roots() {
  const object = useMemo(() => {
    const rng = makeRng(63);
    const g = new THREE.Group();
    const mat = new THREE.LineBasicMaterial({ color: new THREE.Color("#8a6a44"), transparent: true, opacity: 0.8 });
    for (let i = 0; i < 30; i++) {
      const a = rng() * Math.PI * 2;
      const len = 0.2 + rng() * 0.45;
      const pts = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(a) * len * 0.35, -len * 0.5, Math.sin(a) * len * 0.35),
        new THREE.Vector3(Math.cos(a) * len * 0.8, -len, Math.sin(a) * len * 0.8),
      ];
      g.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(new THREE.CatmullRomCurve3(pts).getPoints(10)),
          mat,
        ),
      );
    }
    return g;
  }, []);
  return <primitive object={object} />;
}

export default function SoybeanPlant({ growth }: { growth: number }) {
  const height = 1.9 * (0.35 + 0.65 * growth);
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.z = Math.sin(clock.elapsedTime * 0.6) * 0.012;
  });

  const leaves = useMemo(() => {
    const rng = makeRng(88);
    return Array.from({ length: 9 }, (_, i) => ({
      y: height * (0.18 + (i / 9) * 0.78),
      yaw: i * 2.1 + rng() * 0.4,
      scale: 1.15 - (i / 9) * 0.35,
    }));
  }, [height]);

  const pods = useMemo(() => {
    const rng = makeRng(52);
    return Array.from({ length: 6 }, (_, i) => ({
      y: height * (0.25 + (i / 6) * 0.55),
      yaw: i * 1.7 + rng(),
    }));
  }, [height]);

  return (
    <group ref={group}>
      <Roots />
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.016, 0.03, height, 8]} />
        <meshStandardMaterial color="#3f8a2c" roughness={0.7} />
      </mesh>
      {leaves.map((l, i) => (
        <Trifoliate key={i} y={l.y} yaw={l.yaw} scale={l.scale} />
      ))}
      {pods.map((p, i) => (
        <Pod key={i} y={p.y} yaw={p.yaw} growth={growth} />
      ))}
      <Flowers height={height} />
    </group>
  );
}
