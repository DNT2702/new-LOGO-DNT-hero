import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MotionValue } from "motion/react";

const COUNT = 480;

/** Rasterizes the DNT mark and returns particle target positions sampled from its silhouette. */
function sampleLogoPositions(): Promise<Float32Array> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const size = 80;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(new Float32Array(0));
      ctx.drawImage(img, 0, 0, size, size);

      const { data } = ctx.getImageData(0, 0, size, size);
      const pts: { x: number; y: number }[] = [];
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          if (data[(y * size + x) * 4 + 3] > 60) pts.push({ x, y });
        }
      }
      if (pts.length === 0) return resolve(new Float32Array(0));

      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (const p of pts) {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      }
      const w = maxX - minX || 1;
      const h = maxY - minY || 1;
      const scale = 2.6 / Math.max(w, h);

      const out = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT; i++) {
        const p = pts[Math.floor(Math.random() * pts.length)];
        out[i * 3] = (p.x - minX - w / 2) * scale;
        out[i * 3 + 1] = -(p.y - minY - h / 2) * scale;
        out[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
      }
      resolve(out);
    };
    img.onerror = () => resolve(new Float32Array(0));
    img.src = "/favicon.svg";
  });
}

interface LogoAssemblyProps {
  progress: MotionValue<number>;
}

/**
 * Moment 1 — Digital Genesis. On first load, scattered particles converge
 * into the DNT mark, hold for a beat, then disperse into the universe as
 * the journey begins (either after a few seconds, or as soon as the user scrolls).
 */
export function LogoAssembly({ progress }: LogoAssemblyProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const [targets, setTargets] = useState<Float32Array | null>(null);
  const startTime = useRef<number | null>(null);
  const done = useRef(false);

  const origins = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 5 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi) - 2;
    }
    return arr;
  }, []);

  const positions = useMemo(() => origins.slice(), [origins]);

  const colors = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    const a = new THREE.Color("#7c5cff");
    const b = new THREE.Color("#4ce0ff");
    const tmp = new THREE.Color();
    for (let i = 0; i < COUNT; i++) {
      tmp.copy(a).lerp(b, Math.random());
      arr[i * 3] = tmp.r;
      arr[i * 3 + 1] = tmp.g;
      arr[i * 3 + 2] = tmp.b;
    }
    return arr;
  }, []);

  useEffect(() => {
    sampleLogoPositions().then((t) => {
      if (t.length) setTargets(t);
    });
  }, []);

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points || done.current || !targets) return;

    if (startTime.current === null) startTime.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - startTime.current;
    const p = progress.get();

    let assembled: number;
    let faded: number;
    if (p > 0.02) {
      // User is already scrolling away — skip ahead and dissolve quickly.
      assembled = 1;
      faded = THREE.MathUtils.clamp((p - 0.02) / 0.06, 0, 1);
    } else {
      assembled = THREE.MathUtils.smoothstep(elapsed, 0.15, 1.8);
      faded = THREE.MathUtils.smoothstep(elapsed, 2.8, 4.0);
    }

    const pos = points.geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      arr[i3] = THREE.MathUtils.lerp(origins[i3], targets[i3], assembled);
      arr[i3 + 1] = THREE.MathUtils.lerp(origins[i3 + 1], targets[i3 + 1], assembled);
      arr[i3 + 2] = THREE.MathUtils.lerp(origins[i3 + 2], targets[i3 + 2], assembled);
    }
    pos.needsUpdate = true;

    const mat = points.material as THREE.PointsMaterial;
    mat.opacity = (0.2 + assembled * 0.75) * (1 - faded);

    if (faded >= 1) {
      done.current = true;
      points.visible = false;
    }
  });

  return (
    <points ref={pointsRef} position={[0, 0.4, 3]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.065} vertexColors transparent opacity={0} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}
