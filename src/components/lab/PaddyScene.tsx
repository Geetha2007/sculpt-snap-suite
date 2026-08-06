import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import paddyAsset from "@/assets/paddy.jpg.asset.json";
import { RICE, type Hotspot } from "@/lib/crops";
import { buildBlades, buildPanicles, makeRng } from "./paddy-model";

type SceneProps = {
  growth: number;
  immersive: boolean;
  activeHotspot: string | null;
  onHotspot: (id: string | null) => void;
};

function Blades({ growth }: { growth: number }) {
  const specs = useMemo(() => buildBlades(36, growth), [growth]);
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    group.current?.children.forEach((child, i) => {
      const s = specs[i];
      if (!s) return;
      child.rotation.z = s.tilt + Math.sin(t * 0.7 + s.phase) * s.amplitude;
      child.rotation.x = Math.sin(t * 0.53 + s.phase * 1.7) * s.amplitude * 0.7;
    });
  });

  return (
    <group ref={group}>
      {specs.map((s, i) => (
        <mesh
          key={i}
          geometry={s.geometry}
          position={s.offset}
          rotation={[0, s.yaw, s.tilt]}
          castShadow
        >
          <meshStandardMaterial
            vertexColors
            side={THREE.DoubleSide}
            roughness={0.52}
            metalness={0.04}
            emissive={new THREE.Color("#0e3d18")}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

function Grains({ items }: { items: { pos: THREE.Vector3; scale: number; rot: number }[] }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    items.forEach((g, i) => {
      dummy.position.copy(g.pos);
      dummy.rotation.set(g.rot, g.rot * 0.5, g.rot * 0.3);
      dummy.scale.set(0.0075 * g.scale, 0.021 * g.scale, 0.0075 * g.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [items]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, items.length]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial color="#c9e26a" roughness={0.45} emissive="#3f5210" emissiveIntensity={0.4} />
    </instancedMesh>
  );
}

function Panicles({ growth }: { growth: number }) {
  const specs = useMemo(() => buildPanicles(8, growth), [growth]);
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    group.current?.children.forEach((child, i) => {
      const s = specs[i];
      if (!s) return;
      child.rotation.z = Math.sin(t * 0.6 + s.phase) * 0.035;
    });
  });

  return (
    <group ref={group}>
      {specs.map((s, i) => (
        <group key={i} rotation={[0, s.yaw, 0]}>
          <mesh geometry={s.stem}>
            <meshStandardMaterial color="#7fbe45" roughness={0.6} emissive="#1d3a12" emissiveIntensity={0.35} />
          </mesh>
          <Grains items={s.grains} />
        </group>
      ))}
    </group>
  );
}

function Culms({ growth }: { growth: number }) {
  const specs = useMemo(() => {
    const rng = makeRng(91);
    return Array.from({ length: 9 }, () => ({
      h: (0.5 + rng() * 0.6) * (0.4 + 0.6 * growth),
      yaw: rng() * Math.PI * 2,
      lean: (rng() - 0.5) * 0.3,
      x: (rng() - 0.5) * 0.12,
      z: (rng() - 0.5) * 0.12,
    }));
  }, [growth]);

  return (
    <group>
      {specs.map((s, i) => (
        <mesh key={i} position={[s.x, s.h / 2, s.z]} rotation={[0, s.yaw, s.lean]}>
          <cylinderGeometry args={[0.012, 0.019, s.h, 7]} />
          <meshStandardMaterial color="#4f9433" roughness={0.65} />
        </mesh>
      ))}
    </group>
  );
}

function Dust() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const rng = makeRng(404);
    const arr = new Float32Array(320 * 3);
    for (let i = 0; i < 320; i++) {
      arr[i * 3] = (rng() - 0.5) * 9;
      arr[i * 3 + 1] = rng() * 5;
      arr[i * 3 + 2] = (rng() - 0.5) * 9;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.014;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color="#9fe870" transparent opacity={0.45} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Backdrop() {
  const texture = useTexture(paddyAsset.url);
  return (
    <mesh position={[0, 2.1, -5.6]}>
      <planeGeometry args={[8.5, 4.78]} />
      <meshBasicMaterial map={texture} transparent opacity={0.07} depthWrite={false} />
    </mesh>
  );
}

function Hotspots({
  hotspots,
  active,
  onHotspot,
  hidden,
}: {
  hotspots: Hotspot[];
  active: string | null;
  onHotspot: (id: string | null) => void;
  hidden: boolean;
}) {
  if (hidden) return null;
  return (
    <>
      {hotspots.map((h) => (
        <Html key={h.id} position={h.position} center distanceFactor={11} zIndexRange={[20, 0]}>
          <button
            onClick={() => onHotspot(active === h.id ? null : h.id)}
            className={`readout flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] transition-colors ${
              active === h.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-primary/40 bg-background/70 text-primary hover:border-primary hover:bg-background/90"
            }`}
          >
            <span className="inline-block size-1.5 rounded-full bg-current" />
            {h.label}
          </button>
        </Html>
      ))}
    </>
  );
}

function Rig({
  immersive,
  focus,
}: {
  immersive: boolean;
  focus: [number, number, number] | null;
}) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 1.5, 6.2));
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (immersive) {
      const onMove = (e: PointerEvent) => {
        pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
        pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
    }
    pointer.current = { x: 0, y: 0 };
    return undefined;
  }, [immersive]);

  useEffect(() => {
    if (immersive) target.current.set(0, 1.15, 2.4);
    else if (focus) target.current.set(focus[0] * 2.2, focus[1] + 0.4, focus[2] + 3.1);
    else target.current.set(0, 1.5, 6.2);
  }, [immersive, focus]);

  useFrame(() => {
    if (!immersive && !focus) return;
    camera.position.lerp(target.current, 0.045);
    if (immersive) {
      camera.lookAt(
        pointer.current.x * 1.4,
        1.25 - pointer.current.y * 0.9,
        0,
      );
    }
  });

  return null;
}

function Stage({ growth, immersive, activeHotspot, onHotspot }: SceneProps) {
  const focus = useMemo(() => {
    const h = RICE.hotspots.find((x) => x.id === activeHotspot);
    return h ? h.position : null;
  }, [activeHotspot]);

  return (
    <>
      <color attach="background" args={["#050a07"]} />
      <fog attach="fog" args={["#050a07", 6, 16]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 7, 4]} intensity={1.5} color="#dbffc4" />
      <directionalLight position={[-5, 3, -4]} intensity={1.1} color="#4fe08a" />
      <pointLight position={[0, 1.4, 2.4]} intensity={6} distance={9} color="#a6f04f" />

      <Backdrop />
      <Dust />

      <group position={[0, -1.15, 0]}>
        <Culms growth={growth} />
        <Blades growth={growth} />
        <Panicles growth={growth} />
        <Hotspots
          hotspots={RICE.hotspots}
          active={activeHotspot}
          onHotspot={onHotspot}
          hidden={immersive}
        />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <circleGeometry args={[3.2, 64]} />
          <meshStandardMaterial color="#07130b" roughness={0.25} metalness={0.5} />
        </mesh>
      </group>

      <Rig immersive={immersive} focus={focus} />
      {!immersive && (
        <OrbitControls
          enablePan
          enableZoom
          autoRotate={!activeHotspot}
          autoRotateSpeed={0.5}
          minDistance={2.2}
          maxDistance={9}
          maxPolarAngle={Math.PI * 0.52}
          target={[0, 0.15, 0]}
          makeDefault
        />
      )}
    </>
  );
}

export default function PaddyScene(props: SceneProps) {
  const glRef = useRef<THREE.WebGLRenderer | null>(null);
  const [xrSupported, setXrSupported] = useState(false);

  useEffect(() => {
    const xr = (navigator as Navigator & { xr?: XRSystem }).xr;
    if (!xr?.isSessionSupported) return;
    xr.isSessionSupported("immersive-vr")
      .then(setXrSupported)
      .catch(() => setXrSupported(false));
  }, []);

  const enterVR = async () => {
    const xr = (navigator as Navigator & { xr?: XRSystem }).xr;
    const gl = glRef.current;
    if (!xr || !gl) return;
    try {
      const session = await xr.requestSession("immersive-vr", {
        optionalFeatures: ["local-floor", "bounded-floor"],
      });
      gl.xr.enabled = true;
      await gl.xr.setSession(session as unknown as XRSession);
    } catch {
      setXrSupported(false);
    }
  };

  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 1.5, 6.2], fov: 40 }}
        onCreated={({ gl }) => {
          glRef.current = gl;
        }}
      >
        <Stage {...props} />
      </Canvas>
      {xrSupported && (
        <button
          onClick={enterVR}
          className="readout absolute bottom-6 right-6 rounded-full border border-primary/50 bg-background/70 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-primary backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          Enter VR
        </button>
      )}
    </div>
  );
}