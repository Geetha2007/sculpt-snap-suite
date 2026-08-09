import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { makeRng } from "./paddy-model";
import { wheatBladeGeometry } from "./wheat-model";

/** Broad arching maize blades alternating up the stalk. */
function Leaves({ growth, height }: { growth: number; height: number }) {
  const specs = useMemo(() => {
    const rng = makeRng(311);
    const n = 12;
    return Array.from({ length: n }, (_, i) => {
      const t = 0.08 + (i / n) * 0.8;
      const len = (1.0 + rng() * 0.5) * (0.4 + 0.6 * growth);
      return {
        geometry: wheatBladeGeometry(len, 0.1 + rng() * 0.05, 0.55 + rng() * 0.35),
        y: t * height,
        yaw: i * 2.4 + rng() * 0.3,
        tilt: 0.95 + rng() * 0.35,
        phase: rng() * 6.28,
        amplitude: 0.02 + rng() * 0.03,
      };
    });
  }, [growth, height]);

  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    group.current?.children.forEach((child, i) => {
      const s = specs[i];
      if (!s) return;
      child.rotation.z = s.tilt + Math.sin(t * 0.7 + s.phase) * s.amplitude;
    });
  });

  return (
    <group ref={group}>
      {specs.map((s, i) => (
        <mesh key={i} geometry={s.geometry} position={[0, s.y, 0]} rotation={[0, s.yaw, s.tilt]}>
          <meshStandardMaterial
            vertexColors
            side={THREE.DoubleSide}
            roughness={0.5}
            emissive={new THREE.Color("#12401a")}
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Terminal tassel: a spray of thin golden male flower branches. */
function Tassel({ y }: { y: number }) {
  const object = useMemo(() => {
    const rng = makeRng(77);
    const g = new THREE.Group();
    const mat = new THREE.LineBasicMaterial({ color: new THREE.Color("#f0d264") });
    for (let i = 0; i < 26; i++) {
      const a = rng() * Math.PI * 2;
      const spread = 0.1 + rng() * 0.3;
      const len = 0.35 + rng() * 0.35;
      const pts = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(a) * spread * 0.4, len * 0.6, Math.sin(a) * spread * 0.4),
        new THREE.Vector3(Math.cos(a) * spread, len, Math.sin(a) * spread),
      ];
      const curve = new THREE.CatmullRomCurve3(pts);
      g.add(
        new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(12)), mat),
      );
    }
    return g;
  }, []);

  return <primitive object={object} position={[0, y, 0]} />;
}

function Ear({ y, yaw, growth }: { y: number; yaw: number; growth: number }) {
  const kernels = useMemo(() => {
    const out: { pos: THREE.Vector3; s: number }[] = [];
    const rows = 16;
    const len = 0.42 * (0.5 + 0.5 * growth);
    for (let r = 0; r < rows; r++) {
      const t = r / (rows - 1);
      const rad = 0.055 * (0.55 + 0.75 * Math.sin(Math.min(1, t * 1.15) * Math.PI));
      for (let k = 0; k < 10; k++) {
        const a = (k / 10) * Math.PI * 2;
        out.push({
          pos: new THREE.Vector3(Math.cos(a) * rad, t * len, Math.sin(a) * rad),
          s: rad / 0.055,
        });
      }
    }
    return { out, len };
  }, [growth]);

  const mesh = useRef<THREE.InstancedMesh>(null);
  useMemo(() => {
    const m = mesh.current;
    if (!m) return;
    const d = new THREE.Object3D();
    kernels.out.forEach((k, i) => {
      d.position.copy(k.pos);
      d.scale.setScalar(0.021 * k.s);
      d.updateMatrix();
      m.setMatrixAt(i, d.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [kernels]);

  const silk = useMemo(() => {
    const rng = makeRng(19);
    const g = new THREE.Group();
    const mat = new THREE.LineBasicMaterial({ color: new THREE.Color("#e8f0a8"), transparent: true, opacity: 0.7 });
    for (let i = 0; i < 14; i++) {
      const a = rng() * Math.PI * 2;
      const l = 0.1 + rng() * 0.12;
      g.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(Math.cos(a) * l * 0.6, l, Math.sin(a) * l * 0.6),
          ]),
          mat,
        ),
      );
    }
    return g;
  }, []);

  return (
    <group position={[0.09, y, 0]} rotation={[0, yaw, -0.25]}>
      <instancedMesh
        ref={(r) => {
          mesh.current = r;
          if (!r) return;
          const d = new THREE.Object3D();
          kernels.out.forEach((k, i) => {
            d.position.copy(k.pos);
            d.scale.setScalar(0.021 * k.s);
            d.updateMatrix();
            r.setMatrixAt(i, d.matrix);
          });
          r.instanceMatrix.needsUpdate = true;
        }}
        args={[undefined, undefined, kernels.out.length]}
      >
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial color="#f2c531" roughness={0.45} emissive="#5a3f08" emissiveIntensity={0.35} />
      </instancedMesh>
      <primitive object={silk} position={[0, kernels.len + 0.02, 0]} />
      <mesh position={[0, kernels.len * 0.45, -0.055]} rotation={[0, 0, 0.04]}>
        <boxGeometry args={[0.09, kernels.len * 1.05, 0.02]} />
        <meshStandardMaterial color="#5fa63a" roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function MaizePlant({ growth }: { growth: number }) {
  const height = 2.1 * (0.35 + 0.65 * growth);
  const nodes = 7;
  return (
    <group>
      {/* jointed stalk */}
      {Array.from({ length: nodes }, (_, i) => {
        const seg = height / nodes;
        return (
          <group key={i} position={[0, i * seg + seg / 2, 0]}>
            <mesh>
              <cylinderGeometry args={[0.045 - i * 0.003, 0.052 - i * 0.003, seg * 0.96, 10]} />
              <meshStandardMaterial color="#4f9c33" roughness={0.65} />
            </mesh>
            <mesh position={[0, seg * 0.48, 0]}>
              <torusGeometry args={[0.045, 0.008, 6, 14]} />
              <meshStandardMaterial color="#3d7a26" roughness={0.7} />
            </mesh>
          </group>
        );
      })}
      <Leaves growth={growth} height={height} />
      <Ear y={height * 0.4} yaw={0.6} growth={growth} />
      <Ear y={height * 0.62} yaw={2.6} growth={growth} />
      <Tassel y={height} />
    </group>
  );
}
