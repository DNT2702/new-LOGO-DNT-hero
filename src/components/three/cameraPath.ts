import * as THREE from "three";

export interface Waypoint {
  /** Global scroll progress (0-1) this waypoint applies at */
  p: number;
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
  fog: { color: string; near: number; far: number };
}

/**
 * The camera's journey through the universe, keyed to global scroll progress.
 * Waypoints are timed against each section's measured scroll fraction so that
 * a "world" actually arrives with the content it belongs to:
 *
 *   0.000 - 0.073  Hero          -> World 1: The Origin
 *   0.073 - 0.164  Services      -> Wormhole -> World 2: The Technology Galaxy
 *   0.164 - 0.255  Why DNT        -> World 2 continues
 *   0.255 - 0.618  Portfolio      -> World 4: The Portfolio Museum (holographic city)
 *   0.618 - 0.773  Process        -> World 3: The Creation Engine
 *   0.773 - 0.815  Results        -> World 5: The Results Universe
 *   0.815 - 0.905  Testimonials   -> World 6: The Future
 *   0.905 - 1.000  Contact        -> Collapse
 */
export const waypoints: Waypoint[] = [
  // World 1 — The Origin (Hero)
  { p: 0.0, pos: [0, 0, 6.4], look: [1.4, 0, 0], fov: 38, fog: { color: "#0d0a18", near: 14, far: 36 } },
  { p: 0.05, pos: [1.0, 0.25, 2.0], look: [1.4, 0, -3], fov: 46, fog: { color: "#0a0a16", near: 7, far: 24 } },
  // Wormhole / data tunnel — Hero -> Services, dolly zoom
  { p: 0.085, pos: [0, -0.15, -10], look: [0, 0, -24], fov: 74, fog: { color: "#06141f", near: 1.5, far: 15 } },
  // World 2 — The Technology Galaxy (Services + Why DNT)
  { p: 0.12, pos: [0.6, 0.5, -26], look: [-0.6, 0.1, -40], fov: 46, fog: { color: "#0a0f20", near: 9, far: 32 } },
  { p: 0.2, pos: [-1.2, -0.3, -36], look: [1.0, 0, -50], fov: 44, fog: { color: "#0c0d22", near: 9, far: 32 } },
  // World 4 — The Portfolio Museum (holographic city)
  { p: 0.255, pos: [1.0, 0.3, -44], look: [-1.0, 0, -58], fov: 43, fog: { color: "#1f160a", near: 9, far: 32 } },
  { p: 0.44, pos: [-1.6, -0.3, -64], look: [1.6, 0.1, -80], fov: 45, fog: { color: "#231708", near: 9, far: 32 } },
  // World 3 — The Creation Engine (Process)
  { p: 0.618, pos: [1.6, 0.4, -82], look: [-1.6, 0, -96], fov: 44, fog: { color: "#150c20", near: 8, far: 30 } },
  { p: 0.7, pos: [-1.8, -0.3, -98], look: [1.8, 0.1, -112], fov: 43, fog: { color: "#171025", near: 8, far: 30 } },
  // World 5 — The Results Universe (Results)
  { p: 0.773, pos: [1.4, 0.3, -112], look: [-1.4, 0, -124], fov: 45, fog: { color: "#081e22", near: 8, far: 30 } },
  // World 6 — The Future (Testimonials)
  { p: 0.815, pos: [-1.0, -0.3, -122], look: [1.0, 0.1, -134], fov: 46, fog: { color: "#140a20", near: 7, far: 28 } },
  { p: 0.905, pos: [0, 0.3, -134], look: [0, 0, -144], fov: 44, fog: { color: "#0c0716", near: 4, far: 20 } },
  // Collapse — the universe folds into the contact point (Contact)
  { p: 1.0, pos: [0, 0, -148], look: [0, 0, -160], fov: 27, fog: { color: "#050507", near: 1, far: 11 } },
];

const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();
const colorA = new THREE.Color();
const colorB = new THREE.Color();

export interface CameraSample {
  position: THREE.Vector3;
  look: THREE.Vector3;
  fov: number;
  fogColor: THREE.Color;
  fogNear: number;
  fogFar: number;
}

const sample: CameraSample = {
  position: new THREE.Vector3(),
  look: new THREE.Vector3(),
  fov: 38,
  fogColor: new THREE.Color("#050507"),
  fogNear: 10,
  fogFar: 30,
};

/** Interpolates the camera path at a given global scroll progress (0-1). */
export function sampleCameraPath(progress: number): CameraSample {
  const p = THREE.MathUtils.clamp(progress, 0, 1);

  let i = 0;
  while (i < waypoints.length - 2 && p > waypoints[i + 1].p) i++;

  const a = waypoints[i];
  const b = waypoints[i + 1];
  const span = b.p - a.p;
  const t = span > 0 ? THREE.MathUtils.clamp((p - a.p) / span, 0, 1) : 0;
  const smoothT = t * t * (3 - 2 * t); // smoothstep for gentler beats

  tmpA.set(...a.pos);
  tmpB.set(...b.pos);
  sample.position.copy(tmpA).lerp(tmpB, smoothT);

  tmpA.set(...a.look);
  tmpB.set(...b.look);
  sample.look.copy(tmpA).lerp(tmpB, smoothT);

  sample.fov = THREE.MathUtils.lerp(a.fov, b.fov, smoothT);

  colorA.set(a.fog.color);
  colorB.set(b.fog.color);
  sample.fogColor.copy(colorA).lerp(colorB, smoothT);
  sample.fogNear = THREE.MathUtils.lerp(a.fog.near, b.fog.near, smoothT);
  sample.fogFar = THREE.MathUtils.lerp(a.fog.far, b.fog.far, smoothT);

  return sample;
}
