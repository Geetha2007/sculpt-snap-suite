import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { buildWheatBlades, buildWheatSpikes, type Spikelet } from "./wheat-model";

function Spikelets({ items }: { items: Spikelet[] }) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    items.forEach((s, i) => {
      dummy.position.copy(s.pos);
      dummy.rotation.set(s.pitch, s.yaw, 0);
      dummy.scale.set(0.026 * s.scale, 0.034 * s.scale, 0.026 * s.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [items]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, items.length]} castShadow>
      <sphereGeometry args={[1, 7, 6]} />
      <meshStandardMaterial
        color="#e8cf7a"
        roughness={0.55}
        metalness={0.05}
        emissive="#5c4514"
        emissiveIntensity={0.35}
      />
    </instancedMesh>
  );
}

function Blades({ growth }: { growth: number }) {
  const specs = useMemo(() => buildWheatBlades(22, growth), [growth]);
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    group.current?.children.forEach((child, i) => {
      const s = specs[i];
      if (!s) return;
      child.rotation.z = s.tilt + Math.sin(t * 0.75 + s.phase) * s.amplitude;
      child.rotation.x = Math.sin(t * 0.51 + s.phase * 1.6) * s.amplitude * 0.6;
    });
  });

  return (
    <group ref={group}>
      {specs.map((s, i) => (
        <mesh key={i} geometry={s.geometry} position={s.offset} rotation={[0, s.yaw, s.tilt]}>
          <meshStandardMaterial
            vertexColors
            side={THREE.DoubleSide}
            roughness={0.5}
            emissive={new THREE.Color("#123f16")}
            emissiveIntensity={0.45}
          />
        </mesh>
      ))}
    </group>
  );
}

function Spikes({ growth }: { growth: number }) {
  const specs = useMemo(() => buildWheatSpikes(7, growth), [growth]);
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    group.current?.children.forEach((child, i) => {
      const s = specs[i];
      if (!s) return;
      child.rotation.z = Math.sin(t * 0.65 + s.phase) * 0.03;
    });
  });

  return (
    <group ref={group}>
      {specs.map((s, i) => (
        <group key={i} position={[s.x, 0, s.z]} rotation={[0, s.yaw, 0]}>
          <mesh geometry={s.culm}>
            <meshStandardMaterial color="#b9c85f" roughness={0.7} />
          </mesh>
          <Spikelets items={s.spikelets} />
          {s.awns.map((g, k) => (
            <line key={k}>
              <primitive object={g} attach="geometry" />
              <lineBasicMaterial color="#f2e2a8" transparent opacity={0.75} />
            </line>
          ))}
        </group>
      ))}
    </group>
  );
}

export default function WheatPlant({ growth }: { growth: number }) {
  return (
    <group>
      <Blades growth={growth} />
      <Spikes growth={growth} />
    </group>
  );
}
