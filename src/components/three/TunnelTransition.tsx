import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface TunnelTransitionProps {
  zStart?: number;
  zEnd?: number;
  count?: number;
}

const colorPurple = new THREE.Color("#7c5cff");
const colorCyan = new THREE.Color("#4ce0ff");

/**
 * A data tunnel of light streaks the camera flies through between World 1
 * and World 2 — the "wormhole" connecting the Origin to the Technology Galaxy.
 */
export function TunnelTransition({ zStart = 4, zEnd = -30, count = 480 }: TunnelTransitionProps) {
  const lineRef = useRef<THREE.LineSegments>(null);

  const { positions, colors, speeds, lengths, baseZ } = useMemo(() => {
    const positions = new Float32Array(count * 2 * 3);
    const colors = new Float32Array(count * 2 * 3);
    const speeds = new Float32Array(count);
    const lengths = new Float32Array(count);
    const baseZ = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 1.5 + Math.random() * 5.5;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.6;
      const z = zStart + Math.random() * (zEnd - zStart);
      const len = 0.4 + Math.random() * 1.6;
      const span = zEnd - zStart;
      const tone = THREE.MathUtils.clamp((z - zStart) / span, 0, 1);
      const c = colorPurple.clone().lerp(colorCyan, tone);

      const i6 = i * 6;
      positions[i6 + 0] = x;
      positions[i6 + 1] = y;
      positions[i6 + 2] = z;
      positions[i6 + 3] = x;
      positions[i6 + 4] = y;
      positions[i6 + 5] = z - len;

      colors[i6 + 0] = c.r;
      colors[i6 + 1] = c.g;
      colors[i6 + 2] = c.b;
      colors[i6 + 3] = c.r;
      colors[i6 + 4] = c.g;
      colors[i6 + 5] = c.b;

      speeds[i] = 1.2 + Math.random() * 2.2;
      lengths[i] = len;
      baseZ[i] = z;
    }

    return { positions, colors, speeds, lengths, baseZ };
  }, [count, zStart, zEnd]);

  useFrame((state, delta) => {
    const line = lineRef.current;
    if (!line) return;
    const pos = line.geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const span = zEnd - zStart;

    for (let i = 0; i < count; i++) {
      const i6 = i * 6;
      baseZ[i] += speeds[i] * delta;
      if (baseZ[i] > zStart) baseZ[i] -= span;
      const z = baseZ[i];
      arr[i6 + 2] = z;
      arr[i6 + 5] = z - lengths[i];
    }
    pos.needsUpdate = true;
    line.rotation.z = state.clock.elapsedTime * 0.025;
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <lineBasicMaterial vertexColors transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
    </lineSegments>
  );
}
