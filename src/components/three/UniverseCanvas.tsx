import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette, ChromaticAberration, DepthOfField } from "@react-three/postprocessing";
import { useScroll } from "motion/react";
import * as THREE from "three";
import { CameraRig } from "./CameraRig";
import { World1Origin } from "./World1Origin";
import { LogoAssembly } from "./LogoAssembly";
import { TunnelTransition } from "./TunnelTransition";
import { TechGalaxy } from "./TechGalaxy";
import { DeepSpaceField } from "./DeepSpaceField";
import { HoloCity } from "./HoloCity";
import { CollapseCore } from "./CollapseCore";

function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 4, 4]} intensity={18} color="#a78bfa" />
      <pointLight position={[-4, -2, -3]} intensity={16} color="#4ce0ff" />
      <pointLight position={[0, 3, -4]} intensity={9} color="#ffc56b" />
      <pointLight position={[0, 2, -64]} intensity={20} color="#ffc56b" />
      <pointLight position={[0, -2, -98]} intensity={20} color="#7c5cff" />
      <pointLight position={[0, 0, -130]} intensity={16} color="#4ce0ff" />
    </>
  );
}

/**
 * The persistent, full-viewport WebGL universe behind the entire site.
 * One camera, one journey — scroll drives the film camera through six worlds.
 */
export function UniverseCanvas() {
  const [reduced, setReduced] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    setReduced(window.innerWidth < 768 || window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6.4], fov: 38, far: 250 }}
        dpr={[1, reduced ? 1.25 : 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        eventSource={document.body}
        eventPrefix="page"
        className="!touch-none"
      >
        <color attach="background" args={["#0d0a18"]} />
        <Suspense fallback={null}>
          <Lights />
          <CameraRig progress={scrollYProgress} />

          <World1Origin reduced={reduced} />
          {!reduced && <LogoAssembly progress={scrollYProgress} />}
          {!reduced && <TunnelTransition />}
          <TechGalaxy reduced={reduced} />
          <DeepSpaceField reduced={reduced} />
          <HoloCity reduced={reduced} />
          <CollapseCore progress={scrollYProgress} reduced={reduced} />

          <EffectComposer enableNormalPass={false}>
            <Bloom intensity={0.35} luminanceThreshold={0.35} luminanceSmoothing={0.3} mipmapBlur radius={0.5} />
            <DepthOfField focusDistance={0.04} focalLength={0.03} bokehScale={reduced ? 0 : 2} />
            <Vignette eskil={false} offset={0.18} darkness={0.85} />
            <ChromaticAberration offset={reduced ? new THREE.Vector2(0, 0) : new THREE.Vector2(0.0006, 0.0006)} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
