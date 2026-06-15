import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

export type OrbShape = "icosahedron" | "box" | "octahedron" | "torusKnot" | "torus" | "cone" | "dodecahedron" | "sphere";

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 viewDir = normalize(-vViewPosition);
    float fresnel = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 2.6);

    float shift = sin(uTime * 0.6) * 0.5 + 0.5;
    vec3 holo = mix(uColorA, uColorB, shift);
    vec3 base = mix(vec3(0.02, 0.015, 0.05), holo, 0.25 + fresnel * 0.5);
    vec3 color = base + holo * fresnel * 0.9;

    gl_FragColor = vec4(color, 0.55 + fresnel * 0.45);
  }
`;

function Geometry({ shape }: { shape: OrbShape }) {
  switch (shape) {
    case "box":
      return <boxGeometry args={[1.3, 1.3, 1.3]} />;
    case "octahedron":
      return <octahedronGeometry args={[1.2, 0]} />;
    case "torusKnot":
      return <torusKnotGeometry args={[0.62, 0.22, 80, 10]} />;
    case "torus":
      return <torusGeometry args={[0.8, 0.3, 16, 48]} />;
    case "cone":
      return <coneGeometry args={[0.9, 1.4, 6]} />;
    case "dodecahedron":
      return <dodecahedronGeometry args={[1, 0]} />;
    case "sphere":
      return <sphereGeometry args={[1, 32, 32]} />;
    case "icosahedron":
    default:
      return <icosahedronGeometry args={[1, 0]} />;
  }
}
const COLOR_PAIRS = [
  { a: "#7c5cff", b: "#4ce0ff" }, // Purple / Cyan (original)
  { a: "#ffc56b", b: "#ff5e62" }, // Gold / Crimson
  { a: "#00f2fe", b: "#4facfe" }, // Cyan / Ice Blue
  { a: "#30cfd0", b: "#330867" }, // Teal / Deep Violet
  { a: "#f093fb", b: "#f5576c" }, // Pink / Rose
  { a: "#43e97b", b: "#38f9d7" }, // Green / Turquoise
];

function Shape({ shape, colorA, colorB }: { shape: OrbShape; colorA: string; colorB: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
    }),
    [colorA, colorB]
  );

  useFrame((state, delta) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += delta;
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.y += delta * 0.42;
    }
    if (groupRef.current) {
      const { x, y } = state.pointer;
      pointer.current.x += (x - pointer.current.x) * 0.08;
      pointer.current.y += (y - pointer.current.y) * 0.08;
      groupRef.current.rotation.y = pointer.current.x * 0.6;
      groupRef.current.rotation.x = -pointer.current.y * 0.4;
    }
  });

  const isSpinning = useRef(false);
  const spinGroupRef = useRef<THREE.Group>(null);
  
  // Track color index locally for this orb instance
  const paletteIndex = useRef(0);

  const handleSpinClick = (e: any) => {
    e.stopPropagation();
    if (spinGroupRef.current && !isSpinning.current) {
      isSpinning.current = true;
      
      // Determine next color index
      paletteIndex.current = (paletteIndex.current + 1) % COLOR_PAIRS.length;
      const nextPair = COLOR_PAIRS[paletteIndex.current];
      const targetA = new THREE.Color(nextPair.a);
      const targetB = new THREE.Color(nextPair.b);

      // Spin rotation animation
      gsap.to(spinGroupRef.current.rotation, {
        y: spinGroupRef.current.rotation.y + Math.PI * 2,
        x: spinGroupRef.current.rotation.x + Math.PI * 2,
        duration: 1.2,
        ease: "power2.inOut",
        onComplete: () => {
          isSpinning.current = false;
        }
      });

      // Shift colors animation via uniforms
      if (matRef.current) {
        gsap.to(matRef.current.uniforms.uColorA.value, {
          r: targetA.r,
          g: targetA.g,
          b: targetA.b,
          duration: 1.2,
          ease: "power2.inOut",
        });
        gsap.to(matRef.current.uniforms.uColorB.value, {
          r: targetB.r,
          g: targetB.g,
          b: targetB.b,
          duration: 1.2,
          ease: "power2.inOut",
        });
      }
    }
  };

  return (
    <group ref={groupRef}>
      <group 
        ref={spinGroupRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'auto';
        }}
        onClick={handleSpinClick}
      >
        <mesh ref={meshRef} scale={0.85}>
          <Geometry shape={shape} />
          <shaderMaterial
            ref={matRef}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
            transparent
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}

interface MiniOrbProps {
  shape: OrbShape;
  colorA?: string;
  colorB?: string;
  className?: string;
  eager?: boolean;
}

export function MiniOrb({ shape, colorA = "#7c5cff", colorB = "#4ce0ff", className, eager = false }: MiniOrbProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(eager);

  useEffect(() => {
    if (eager) return; // Skip observer if eager rendering is enabled
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "150px" } // trigger 150px before entering viewport for a seamless appearance
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [eager]);

  return (
    <div ref={containerRef} className={className ?? "h-full w-full"} style={{ minHeight: "100%" }}>
      {inView ? (
        <Canvas
          camera={{ position: [0, 0, 2.6], fov: 40 }}
          dpr={1}
          gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
          className="!touch-none"
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <pointLight position={[2, 2, 2]} intensity={10} color={colorA} />
            <pointLight position={[-2, -1, -2]} intensity={8} color={colorB} />
            <Shape shape={shape} colorA={colorA} colorB={colorB} />
            <Sparkles count={10} scale={2.4} size={1.2} speed={0.3} color={colorB} opacity={0.6} />
          </Suspense>
        </Canvas>
      ) : null}
    </div>
  );
}
