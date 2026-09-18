import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { buildBlades, buildPanicles, makeRng } from "./paddy-model";
import { buildRiceRoots } from "./rice-root-model";

function RiceLeaves({ growth }: { growth: number }) {
  const specs = useMemo(() => buildBlades(40, growth, 17), [growth]);
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    group.current?.children.forEach((child, i) => {
      const spec = specs[i];
      if (!spec) return;
      child.rotation.z = spec.tilt + Math.sin(t * 0.55 + spec.phase) * spec.amplitude * 0.55;
      child.rotation.x = Math.sin(t * 0.42 + spec.phase) * spec.amplitude * 0.35;
    });
  });

  return (
    <group ref={group}>
      {specs.map((spec, index) => (
        <mesh
          key={index}
          geometry={spec.geometry}
          position={spec.offset}
          rotation={[0, spec.yaw, spec.tilt]}
          castShadow
        >
          <meshPhysicalMaterial
            vertexColors
            side={THREE.DoubleSide}
            roughness={0.62}
            clearcoat={0.12}
            clearcoatRoughness={0.75}
          />
        </mesh>
      ))}
    </group>
  );
}

function RicePanicles({ growth }: { growth: number }) {
  const specs = useMemo(() => buildPanicles(10, growth, 31), [growth]);
  const group = useRef<THREE.Group>(null);
  const ripeness = Math.max(0, (growth - 0.58) / 0.42);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    group.current?.children.forEach((child, i) => {
      const spec = specs[i];
      if (spec) child.rotation.z = Math.sin(t * 0.42 + spec.phase) * 0.014;
    });
  });

  return (
    <group ref={group}>
      {specs.map((spec, index) => (
        <group key={index} rotation={[0, spec.yaw, 0]}>
          <mesh geometry={spec.stem} castShadow>
            <meshStandardMaterial color="#69933e" roughness={0.78} />
          </mesh>
          <Grains items={spec.grains} ripeness={ripeness} />
        </group>
      ))}
    </group>
  );
}

function Grains({
  items,
  ripeness,
}: {
  items: { pos: THREE.Vector3; scale: number; rot: number }[];
  ripeness: number;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    items.forEach((grain, index) => {
      dummy.position.copy(grain.pos);
      dummy.rotation.set(grain.rot, grain.rot * 0.45, grain.rot * 0.25);
      dummy.scale.set(0.008 * grain.scale, 0.023 * grain.scale, 0.007 * grain.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [items]);

  const color = new THREE.Color("#a9c765").lerp(new THREE.Color("#d4ad54"), ripeness);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, items.length]} castShadow>
      <capsuleGeometry args={[1, 1.5, 4, 7]} />
      <meshStandardMaterial color={color} roughness={0.68} />
    </instancedMesh>
  );
}

function JointedCulms({ growth }: { growth: number }) {
  const culms = useMemo(() => {
    const rng = makeRng(91);
    return Array.from({ length: 12 }, (_, i) => ({
      height: (1.28 + rng() * 0.68) * (0.55 + growth * 0.45),
      x: (rng() - 0.5) * 0.16,
      z: (rng() - 0.5) * 0.16,
      lean: (rng() - 0.5) * 0.12,
      yaw: (i / 12) * Math.PI * 2 + rng() * 0.2,
    }));
  }, [growth]);

  return (
    <group>
      {culms.map((culm, index) => (
        <group key={index} position={[culm.x, 0, culm.z]} rotation={[0, culm.yaw, culm.lean]}>
          <mesh position={[0, culm.height / 2, 0]} castShadow>
            <cylinderGeometry args={[0.009, 0.017, culm.height, 10]} />
            <meshPhysicalMaterial color="#4f8438" roughness={0.7} clearcoat={0.08} />
          </mesh>
          {[0.23, 0.46, 0.69].map((fraction) => (
            <mesh key={fraction} position={[0, culm.height * fraction, 0]}>
              <torusGeometry args={[0.014, 0.0025, 5, 12]} />
              <meshStandardMaterial color="#78934d" roughness={0.8} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, 0.035, 0]} scale={[1.1, 0.35, 1.1]}>
        <sphereGeometry args={[0.15, 16, 10]} />
        <meshStandardMaterial color="#6b7539" roughness={0.92} />
      </mesh>
    </group>
  );
}

function RootSystem({ growth }: { growth: number }) {
  const model = useMemo(() => buildRiceRoots(growth), [growth]);
  return (
    <group>
      {model.roots.map((root, index) => (
        <mesh key={index} geometry={root.geometry} castShadow>
          <meshStandardMaterial
            color={root.kind === "nodal" ? "#d2b879" : "#bda169"}
            roughness={0.92}
          />
        </mesh>
      ))}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[model.hairs.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[model.hairs.colors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.58} />
      </lineSegments>
    </group>
  );
}

function soilTexture(base: string, dark: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.fillStyle = base;
  context.fillRect(0, 0, 128, 128);
  const rng = makeRng(802);
  for (let i = 0; i < 620; i++) {
    context.globalAlpha = 0.12 + rng() * 0.35;
    context.fillStyle = rng() > 0.58 ? dark : "#8b7656";
    const radius = 0.35 + rng() * 2.1;
    context.beginPath();
    context.arc(rng() * 128, rng() * 128, radius, 0, Math.PI * 2);
    context.fill();
  }
  context.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2.8, 1.7);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function RiceSoilCutaway() {
  const topsoil = useMemo(() => soilTexture("#59472f", "#2e261c"), []);
  const subsoil = useMemo(() => soilTexture("#715638", "#44321f"), []);

  useEffect(() => () => {
    topsoil?.dispose();
    subsoil?.dispose();
  }, [topsoil, subsoil]);

  return (
    <group position={[0, -0.61, -0.2]}>
      <mesh position={[0, 0.4, -0.42]} receiveShadow>
        <boxGeometry args={[2.35, 0.42, 1.15]} />
        <meshStandardMaterial map={topsoil} color="#695238" roughness={1} />
      </mesh>
      <mesh position={[0, -0.11, -0.42]} receiveShadow>
        <boxGeometry args={[2.35, 0.6, 1.15]} />
        <meshStandardMaterial map={subsoil} color="#7b5b39" roughness={1} />
      </mesh>
      <mesh position={[0, -0.51, -0.42]} receiveShadow>
        <boxGeometry args={[2.35, 0.2, 1.15]} />
        <meshStandardMaterial color="#9a7449" roughness={0.96} />
      </mesh>
      <mesh position={[0, 0.625, -0.38]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.4, 1.2, 12, 8]} />
        <meshPhysicalMaterial color="#302b20" roughness={0.54} clearcoat={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.17]}>
        <planeGeometry args={[2.32, 1.2]} />
        <meshStandardMaterial color="#8b6843" roughness={0.95} transparent opacity={0.22} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function CompleteRicePlant({ growth }: { growth: number }) {
  return (
    <group>
      <RootSystem growth={growth} />
      <JointedCulms growth={growth} />
      <RiceLeaves growth={growth} />
      <RicePanicles growth={growth} />
    </group>
  );
}
