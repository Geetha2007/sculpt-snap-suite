import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { makeRng } from "./paddy-model";
import { wheatBladeGeometry } from "./wheat-model";

type Cane = {
  x: number;
  z: number;
  lean: number;
  yaw: number;
  height: number;
  nodes: number;
  phase: number;
};

function CaneStalk({ cane, growth }: { cane: Cane; growth: number }) {
  const seg = cane.height / cane.nodes;
  const leaves = useMemo(() => {
    const rng = makeRng(Math.floor(cane.phase * 1000));
    return Array.from({ length: 7 }, (_, i) => ({
      geometry: wheatBladeGeometry(1.0 + rng() * 0.75, 0.035 + rng() * 0.02, 0.65 + rng() * 0.4),
      yaw: i * 1.9 + rng(),
      tilt: 0.75 + rng() * 0.55,
      y: cane.height * (0.86 + rng() * 0.16),
    }));
  }, [cane]);

  return (
    <group position={[cane.x, 0, cane.z]} rotation={[0, cane.yaw, cane.lean]}>
      {Array.from({ length: cane.nodes }, (_, i) => (
        <group key={i} position={[0, i * seg + seg / 2, 0]}>
          <mesh>
            <cylinderGeometry args={[0.036, 0.04, seg * 0.94, 10]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#9bb741" : "#8fae3c"}
              roughness={0.6}
              emissive="#2b3a0d"
              emissiveIntensity={0.25}
            />
          </mesh>
          <mesh position={[0, seg * 0.47, 0]}>
            <torusGeometry args={[0.038, 0.007, 6, 14]} />
            <meshStandardMaterial color="#b6803a" roughness={0.7} />
          </mesh>
        </group>
      ))}
      {leaves.map((l, i) => (
        <mesh key={i} geometry={l.geometry} position={[0, l.y, 0]} rotation={[0, l.yaw, l.tilt]}>
          <meshStandardMaterial
            vertexColors
            side={THREE.DoubleSide}
            roughness={0.5}
            emissive={new THREE.Color("#14401b")}
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}
      <mesh visible={growth > 0.9} position={[0, cane.height + 0.28, 0]}>
        <coneGeometry args={[0.05, 0.5, 8, 1, true]} />
        <meshStandardMaterial color="#e0dcc0" roughness={0.8} transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function SugarcanePlant({ growth }: { growth: number }) {
  const canes = useMemo<Cane[]>(() => {
    const rng = makeRng(202);
    return Array.from({ length: 9 }, () => {
      const a = rng() * Math.PI * 2;
      const r = rng() * 0.32;
      return {
        x: Math.cos(a) * r,
        z: Math.sin(a) * r,
        lean: (rng() - 0.5) * 0.22,
        yaw: rng() * Math.PI * 2,
        height: (1.9 + rng() * 0.85) * (0.35 + 0.65 * growth),
        nodes: 9,
        phase: rng(),
      };
    });
  }, [growth]);

  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.z = Math.sin(clock.elapsedTime * 0.5) * 0.008;
  });

  return (
    <group ref={group}>
      {canes.map((c, i) => (
        <CaneStalk key={i} cane={c} growth={growth} />
      ))}
      <mesh position={[0, 0.04, 0]}>
        <sphereGeometry args={[0.4, 16, 10]} />
        <meshStandardMaterial color="#5a4326" roughness={0.95} />
      </mesh>
    </group>
  );
}
