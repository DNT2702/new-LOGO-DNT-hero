import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MotionValue } from "motion/react";

interface CollapseCoreProps {
  progress: MotionValue<number>;
  reduced?: boolean;
}

const CENTER_Z = -148;

/**
 * The final signature moment — as the journey nears its end, scattered
 * particles converge and collapse into a single bright point: the contact core.
 */
export function CollapseCore({ progress, reduced = false }: CollapseCoreProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const count = reduced ? 250 : 600;

  const { positions, origins } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const origins = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = 4 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = CENTER_Z + r * Math.cos(phi);
      origins[i3] = x;
      origins[i3 + 1] = y;
      origins[i3 + 2] = z;
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
    }
    return { positions, origins };
  }, [count]);

  useFrame((state) => {
    const p = progress.get();
    const collapse = THREE.MathUtils.smoothstep(p, 0.89, 1.0);

    const points = pointsRef.current;
    if (points) {
      const pos = points.geometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        arr[i3] = THREE.MathUtils.lerp(origins[i3], 0, collapse);
        arr[i3 + 1] = THREE.MathUtils.lerp(origins[i3 + 1], 0, collapse);
        arr[i3 + 2] = THREE.MathUtils.lerp(origins[i3 + 2], CENTER_Z, collapse);
      }
      pos.needsUpdate = true;
      const mat = points.material as THREE.PointsMaterial;
      mat.opacity = 0.5 + collapse * 0.5;
      mat.size = 0.04 + collapse * 0.05;
    }

    const core = coreRef.current;
    if (core) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.08;
      const scale = (0.4 + collapse * 1.6) * pulse;
      core.scale.setScalar(scale);
      const mat = core.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.15 + collapse * 0.75;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.04} color="#4ce0ff" transparent opacity={0.5} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <mesh ref={coreRef} position={[0, 0, CENTER_Z]}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial color="#7c5cff" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}
