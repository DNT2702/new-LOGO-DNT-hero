import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Building {
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  color: string;
}

const CITY_Z = -64;

function generateBuildings(): Building[] {
  const buildings: Building[] = [];
  const cols = 5;
  const rows = 2;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      buildings.push({
        x: (c - (cols - 1) / 2) * 6.5 + (Math.random() - 0.5) * 1.8,
        z: CITY_Z + (r - 0.5) * 8 + (Math.random() - 0.5) * 2,
        width: 1 + Math.random() * 1.2,
        depth: 1 + Math.random() * 1.2,
        height: 1.5 + Math.random() * 4.5,
        color: Math.random() > 0.5 ? "#ffc56b" : "#4ce0ff",
      });
    }
  }
  return buildings;
}

function BuildingMesh({ b }: { b: Building }) {
  return (
    <mesh position={[b.x, b.height / 2 - 4, b.z]}>
      <boxGeometry args={[b.width, b.height, b.depth]} />
      <meshBasicMaterial color={b.color} wireframe transparent opacity={0.14} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

function LightShaft({ x, z, color }: { x: number; z: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    const mat = mesh.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.02 + Math.sin(state.clock.elapsedTime * 0.6 + x) * 0.008;
  });

  return (
    <mesh ref={ref} position={[x, 7, z]}>
      <coneGeometry args={[1.8, 10, 24, 1, true]} />
      <meshBasicMaterial color={color} transparent opacity={0.025} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

/**
 * World 4 — The Portfolio Museum. A holographic city skyline of wireframe
 * towers with soft light shafts, sitting in the camera's path between the
 * gold and cyan portal rings.
 */
export function HoloCity({ reduced = false }: { reduced?: boolean }) {
  const buildings = useMemo(() => generateBuildings(), []);

  if (reduced) return null;

  return (
    <group>
      {buildings.map((b, i) => (
        <BuildingMesh key={i} b={b} />
      ))}
      <LightShaft x={-6} z={CITY_Z - 4} color="#ffc56b" />
      <LightShaft x={6} z={CITY_Z + 4} color="#4ce0ff" />
    </group>
  );
}
