import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

import type { CellLayer } from "@/lib/crops";

function Section({ layers, active }: { layers: CellLayer[]; active: string | null }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = clock.elapsedTime * 0.25;
  });

  return (
    <group ref={group} rotation={[0.35, 0, 0]}>
      {layers.map((layer, i) => {
        const y = (layers.length / 2 - i) * 0.26;
        const dim = active !== null && active !== layer.id;
        return (
          <group key={layer.id} position={[0, y, 0]}>
            <mesh>
              <boxGeometry args={[1.9, 0.18, 0.9]} />
              <meshStandardMaterial
                color={layer.color}
                roughness={0.35}
                metalness={0.1}
                transparent
                opacity={dim ? 0.22 : 0.92}
                emissive={new THREE.Color(layer.color)}
                emissiveIntensity={dim ? 0.05 : 0.35}
              />
            </mesh>
            {layer.id === "vascular" && (
              <>
                <mesh position={[-0.35, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.07, 0.07, 0.92, 12]} />
                  <meshStandardMaterial color="#f0e0a0" emissive="#7a5c10" emissiveIntensity={0.4} />
                </mesh>
                <mesh position={[0.35, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.05, 0.05, 0.92, 12]} />
                  <meshStandardMaterial color="#bfe9d6" emissive="#12513c" emissiveIntensity={0.4} />
                </mesh>
              </>
            )}
            {layer.id === "aerenchyma" &&
              [-0.6, -0.2, 0.2, 0.6].map((x) => (
                <mesh key={x} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.09, 0.09, 0.94, 10]} />
                  <meshStandardMaterial color="#04140f" roughness={1} />
                </mesh>
              ))}
          </group>
        );
      })}
    </group>
  );
}

export default function CellScene({
  layers,
  active,
}: {
  layers: CellLayer[];
  active: string | null;
}) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0.4, 3.4], fov: 40 }}>
      <color attach="background" args={["#060d09"]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 3]} intensity={1.4} />
      <directionalLight position={[-3, -2, -2]} intensity={0.6} color="#7ef0a8" />
      <Section layers={layers} active={active} />
      <OrbitControls enablePan={false} enableZoom={false} />
    </Canvas>
  );
}