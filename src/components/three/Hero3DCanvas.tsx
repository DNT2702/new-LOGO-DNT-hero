import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { InteractiveLogo } from "./InteractiveLogo";
import { BackgroundParticles } from "./BackgroundParticles";

export function Hero3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 h-full w-full pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]} // Clamped from 2 to 1.5 to reduce pixel rendering load on high-DPI screens
        frameloop={inView ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.25} />
          {/* Main directional light */}
          <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
          {/* Blue Neon fill lights */}
          <pointLight position={[-4, -2, 2]} intensity={1.5} color="#00C8FF" />
          <pointLight position={[4, -4, 2]} intensity={1.2} color="#3B82F6" />
          
          {/* Rim light behind */}
          <pointLight position={[0, 4, -4]} intensity={2.5} color="#ffffff" />

          {/* Interactive Logo */}
          <InteractiveLogo />

          {/* Background Particles Environment */}
          <BackgroundParticles count={110} />

          {/* Post Processing Effects */}
          <EffectComposer>
            <Bloom 
              intensity={0.7} // Reduced from 1.2 to soften brightness and overexposure
              luminanceThreshold={0.5} 
              luminanceSmoothing={0.9} 
              mipmapBlur 
              radius={0.8} 
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
