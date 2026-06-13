import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface PortalRingProps {
  z: number;
  color: string;
}

/** A holographic ring marking the threshold between worlds — pulses as the camera passes through it. */
function PortalRing({ z, color }: PortalRingProps) {
  const ref = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    const dist = Math.abs(camera.position.z - z);
    const proximity = THREE.MathUtils.clamp(1 - dist / 14, 0, 1);
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.04;
    mesh.scale.setScalar((1 + proximity * 0.35) * pulse);
    const mat = mesh.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.12 + proximity * 0.55;
    mesh.rotation.z += 0.0015;
  });

  return (
    <mesh ref={ref} position={[0, 0, z]}>
      <torusGeometry args={[9, 0.045, 16, 96]} />
      <meshBasicMaterial color={color} transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

const portals: PortalRingProps[] = [
  { z: -44, color: "#ffc56b" }, // into World 4 — Portfolio Museum
  { z: -82, color: "#a78bfa" }, // into World 3 — Creation Engine
  { z: -112, color: "#4ce0ff" }, // into World 5 — Results Universe
  { z: -122, color: "#a78bfa" }, // into World 6 — The Future
];

/**
 * Worlds 3-6 — a deep-space starfield connecting the Creation Engine,
 * Portfolio Museum, Results Universe and The Future, threaded with
 * holographic portal rings marking each transition.
 */
export function DeepSpaceField({ reduced = false }: { reduced?: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = reduced ? 700 : 1800;

  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 50;
      positions[i3 + 1] = (Math.random() - 0.5) * 30;
      positions[i3 + 2] = -10 - Math.random() * 150;
    }
    return positions;
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.006;
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.045} color="#dfe3ff" transparent opacity={0.55} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      {portals.map((portal) => (
        <PortalRing key={portal.z} {...portal} />
      ))}
    </group>
  );
}
