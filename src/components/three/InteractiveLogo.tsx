import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

// 12 diamond-spark positions scattered across the logo UV space
const SPARK_POSITIONS: [number, number][] = [
  [0.30, 0.55], [0.55, 0.70], [0.72, 0.45],
  [0.45, 0.28], [0.62, 0.62], [0.38, 0.75],
  [0.80, 0.60], [0.25, 0.38], [0.68, 0.30],
  [0.50, 0.50], [0.42, 0.60], [0.60, 0.78],
];

export function InteractiveLogo() {
  const outerGroupRef = useRef<THREE.Group>(null);
  const spinGroupRef = useRef<THREE.Group>(null);

  const texture = useTexture("/dnt logo.jpg");
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.minFilter = THREE.LinearMipMapLinearFilter;
  texture.magFilter = THREE.LinearFilter;

  // @ts-ignore
  const aspect = texture.image
    ? (texture.image as HTMLImageElement).width / (texture.image as HTMLImageElement).height
    : 1;
  const width = 6.5;
  const height = width / aspect;

  const [hovered, setHovered] = useState(false);
  const isSpinning = useRef(false);
  const mouse = useRef(new THREE.Vector2());

  /* ── Shared shader uniforms ────────────────────────────────── */
  const uniforms = useMemo(() => ({
    mouseUV: { value: new THREE.Vector2(0.5, 0.5) },
    goldBlend: { value: 0.0 },
    uTime: { value: 0.0 },
  }), []);

  /* ── Per-frame uniform updates ──────────────────────────────── */
  useFrame((state) => {
    // Smooth pointer tracking
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, state.pointer.x, 0.05);
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, state.pointer.y, 0.05);

    // Convert NDC → UV
    uniforms.mouseUV.value.set(
      mouse.current.x * 0.5 + 0.5,
      mouse.current.y * 0.5 + 0.5,
    );

    // Animate gold in/out
    uniforms.goldBlend.value = THREE.MathUtils.lerp(
      uniforms.goldBlend.value,
      hovered ? 1.0 : 0.0,
      0.06,
    );

    // Pass elapsed time for sparkle animation
    uniforms.uTime.value = state.clock.elapsedTime;

    /* Tilt & float */
    const rotX = mouse.current.y * (12 * Math.PI / 180);
    const rotY = mouse.current.x * (15 * Math.PI / 180);

    if (outerGroupRef.current) {
      if (hovered) {
        outerGroupRef.current.rotation.x = THREE.MathUtils.lerp(outerGroupRef.current.rotation.x, rotX, 0.08);
        outerGroupRef.current.rotation.y = THREE.MathUtils.lerp(outerGroupRef.current.rotation.y, rotY, 0.08);
        const floatY = Math.sin(state.clock.elapsedTime) * 0.1;
        outerGroupRef.current.position.x = THREE.MathUtils.lerp(outerGroupRef.current.position.x, 3.5, 0.08);
        outerGroupRef.current.position.y = THREE.MathUtils.lerp(outerGroupRef.current.position.y, floatY, 0.08);
        outerGroupRef.current.position.z = THREE.MathUtils.lerp(
          outerGroupRef.current.position.z,
          Math.abs(mouse.current.x * mouse.current.y) * 1.5,
          0.08,
        );
      } else {
        outerGroupRef.current.rotation.x = THREE.MathUtils.lerp(outerGroupRef.current.rotation.x, 0, 0.05);
        outerGroupRef.current.rotation.y = THREE.MathUtils.lerp(outerGroupRef.current.rotation.y, 0, 0.05);
        const floatY = Math.sin(state.clock.elapsedTime) * 0.1;
        outerGroupRef.current.position.x = THREE.MathUtils.lerp(outerGroupRef.current.position.x, 3.5, 0.05);
        outerGroupRef.current.position.y = THREE.MathUtils.lerp(outerGroupRef.current.position.y, floatY, 0.05);
        outerGroupRef.current.position.z = THREE.MathUtils.lerp(outerGroupRef.current.position.z, 0, 0.05);
      }
    }
  });

  const handleClick = () => {
    if (spinGroupRef.current && !isSpinning.current) {
      isSpinning.current = true;
      gsap.to(spinGroupRef.current.rotation, {
        z: spinGroupRef.current.rotation.z - Math.PI * 2,
        duration: 1.2,
        ease: "power3.inOut",
        onComplete: () => { isSpinning.current = false; },
      });
    }
  };

  /* ── Build spark-positions GLSL array literal ─────────────── */
  const sparkPosGLSL = SPARK_POSITIONS
    .map(([x, y]) => `vec2(${x.toFixed(3)}, ${y.toFixed(3)})`)
    .join(", ");

  return (
    <group
      ref={outerGroupRef}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
      onClick={handleClick}
      position={[3.5, 0, 0]}
    >
      <group ref={spinGroupRef}>
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh key={i} position={[0, 0, i * -0.015]}>
            <planeGeometry args={[width, height]} />

            {i === 0 ? (
              /* ══════════════════════════════════════════════════════
                 TOP LAYER — dark gold · diamond sparks · spark streaks
                 ══════════════════════════════════════════════════════ */
              <meshPhysicalMaterial
                map={texture}
                transparent={true}
                roughness={0.02}
                metalness={0.0}
                clearcoat={1.0}
                clearcoatRoughness={0.01}
                transmission={0.94}
                thickness={2.4}
                ior={1.52}
                emissive={new THREE.Color("#ffffff")}
                emissiveIntensity={0.12}
                side={THREE.DoubleSide}
                depthWrite={true}
                onBeforeCompile={(shader) => {
                  shader.uniforms.mouseUV = uniforms.mouseUV;
                  shader.uniforms.goldBlend = uniforms.goldBlend;
                  shader.uniforms.uTime = uniforms.uTime;

                  /* ── inject uniforms + helpers at top ── */
                  shader.fragmentShader = /* glsl */`
                    uniform vec2  mouseUV;
                    uniform float goldBlend;
                    uniform float uTime;

                    // ── 4-point diamond star (cross + diagonal arms) ──────────
                    float diamondStar(vec2 uv, vec2 center, float size, float rotation) {
                      vec2 d = uv - center;
                      // rotate
                      float c = cos(rotation), s = sin(rotation);
                      d = vec2(c*d.x - s*d.y, s*d.x + c*d.y);

                      float r = length(d);

                      // Main cross arms (long & thin via Gaussian thickness)
                      float armH = exp(-d.y * d.y / (size * size * 0.0015))
                                 * (1.0 - smoothstep(0.0, size * 2.2, abs(d.x)));
                      float armV = exp(-d.x * d.x / (size * size * 0.0015))
                                 * (1.0 - smoothstep(0.0, size * 2.2, abs(d.y)));

                      // Diagonal arms (shorter, thinner = diamond facets)
                      vec2 dDiag1 = vec2(d.x - d.y, d.x + d.y) * 0.707;
                      float diag1 = exp(-dDiag1.y * dDiag1.y / (size * size * 0.003))
                                  * (1.0 - smoothstep(0.0, size * 1.2, abs(dDiag1.x)));
                      vec2 dDiag2 = vec2(d.x + d.y, -d.x + d.y) * 0.707;
                      float diag2 = exp(-dDiag2.y * dDiag2.y / (size * size * 0.003))
                                  * (1.0 - smoothstep(0.0, size * 1.2, abs(dDiag2.x)));

                      // Bright central core
                      float core = 1.0 - smoothstep(0.0, size * 0.35, r);

                      return clamp(core + armH * 0.9 + armV * 0.9 + diag1 * 0.5 + diag2 * 0.5, 0.0, 1.0);
                    }

                    // ── tiny spark streak toward mouse ────────────────────────
                    float sparkStreak(vec2 uv, vec2 center, vec2 toMouse, float size) {
                      vec2 d = uv - center;
                      vec2 dir = normalize(toMouse + vec2(0.0001));
                      float along = dot(d, dir);
                      float perp  = length(d - along * dir);
                      float streak = exp(-perp * perp / (size * size * 0.001))
                                   * (1.0 - smoothstep(0.0, size * 1.5, abs(along)));
                      return clamp(streak, 0.0, 1.0);
                    }
                  ` + shader.fragmentShader;

                  /* ── map_fragment ─────────────────────────────────── */
                  shader.fragmentShader = shader.fragmentShader.replace(
                    `#include <map_fragment>`,
                    /* glsl */`
                    #ifdef USE_MAP
                      vec4 sampledDiffuseColor = texture2D( map, vMapUv );

                      // Remove DNT WEB text corner
                      if (vMapUv.x < 0.25 && vMapUv.y > 0.85) { discard; }

                      // White background cutout
                      float brightness = dot(sampledDiffuseColor.rgb, vec3(0.299, 0.587, 0.114));
                      if (brightness > 0.6) { discard; }

                      // ── BASE GLASS colour ──────────────────────────────────
                      vec3 baseColor = vec3(0.92, 0.96, 1.0);

                      // ── DARK GOLD sweep centred on mouse ──────────────────
                      float distToMouse = length(vMapUv - mouseUV);
                      float mouseSpot   = exp(-distToMouse * distToMouse * 7.0);
                      // Directional sheen streak
                      vec2  shDir    = normalize(vMapUv - mouseUV + vec2(0.0001));
                      float sheen    = pow(max(0.0, 1.0 - abs(dot(shDir, vec2(0.707)))), 5.0);
                      float goldMask = clamp(mouseSpot + sheen * 0.4, 0.0, 1.0);

                      // Dark gold palette — 18-karat rich deep gold
                      vec3 goldDeep   = vec3(0.55, 0.32, 0.02);  // dark bronze-gold
                      vec3 goldRich   = vec3(0.80, 0.55, 0.07);  // deep amber gold
                      vec3 goldBright = vec3(1.00, 0.82, 0.28);  // warm bright gold
                      vec3 goldPeak   = vec3(1.00, 0.96, 0.70);  // champagne highlight
                      vec3 goldColor  = mix(goldDeep,   goldRich,   clamp(goldMask * 1.6,       0.0, 1.0));
                           goldColor  = mix(goldColor,  goldBright, clamp((goldMask - 0.4)*2.5, 0.0, 1.0));
                           goldColor  = mix(goldColor,  goldPeak,   clamp((goldMask - 0.72)*4.0, 0.0, 1.0));

                      // ── DIAMOND SPARKLES ───────────────────────────────────
                      vec2 sparkCenters[12];
                      sparkCenters[0]  = vec2(${SPARK_POSITIONS[0].join(", ")});
                      sparkCenters[1]  = vec2(${SPARK_POSITIONS[1].join(", ")});
                      sparkCenters[2]  = vec2(${SPARK_POSITIONS[2].join(", ")});
                      sparkCenters[3]  = vec2(${SPARK_POSITIONS[3].join(", ")});
                      sparkCenters[4]  = vec2(${SPARK_POSITIONS[4].join(", ")});
                      sparkCenters[5]  = vec2(${SPARK_POSITIONS[5].join(", ")});
                      sparkCenters[6]  = vec2(${SPARK_POSITIONS[6].join(", ")});
                      sparkCenters[7]  = vec2(${SPARK_POSITIONS[7].join(", ")});
                      sparkCenters[8]  = vec2(${SPARK_POSITIONS[8].join(", ")});
                      sparkCenters[9]  = vec2(${SPARK_POSITIONS[9].join(", ")});
                      sparkCenters[10] = vec2(${SPARK_POSITIONS[10].join(", ")});
                      sparkCenters[11] = vec2(${SPARK_POSITIONS[11].join(", ")});

                      float totalSparkle  = 0.0;
                      float totalStreak   = 0.0;

                      for (int s = 0; s < 12; s++) {
                        vec2 sc = sparkCenters[s];
                        float seed = float(s) * 1.618 + 0.37;

                        // Each spark twinkles at its own frequency
                        float twinkle = 0.5 + 0.5 * sin(uTime * (2.5 + seed) + seed * 7.3);
                        // Mouse proximity boosts this sparkle (closer = brighter)
                        float prox    = exp(-length(sc - mouseUV) * 4.0);
                        float sparkAmp = twinkle * (0.35 + prox * 0.65);

                        // Slow gentle rotation per spark
                        float rot = uTime * (0.3 + seed * 0.1);

                        float star = diamondStar(vMapUv, sc, 0.028, rot);

                        // Streak from spark toward cursor
                        float streak = sparkStreak(vMapUv, sc, mouseUV - sc, 0.025) * prox;

                        totalSparkle += star   * sparkAmp;
                        totalStreak  += streak * sparkAmp * 0.6;
                      }
                      totalSparkle = clamp(totalSparkle, 0.0, 1.0);
                      totalStreak  = clamp(totalStreak,  0.0, 1.0);

                      // Diamond colour: cold white-blue core → gold outer
                      vec3 sparkColor  = mix(vec3(1.0, 0.94, 0.62), vec3(1.0, 1.0, 1.0), totalSparkle);
                           sparkColor  = mix(sparkColor, vec3(1.0, 1.0, 1.0), clamp(totalSparkle * 2.0 - 1.0, 0.0, 1.0));
                      vec3 streakColor = vec3(1.00, 0.88, 0.42);  // golden streak

                      // ── EDGE GLOW (inner rim) ──────────────────────────────
                      vec3 edgeBase = vec3(1.3);
                      if (brightness > 0.48 && brightness <= 0.6) {
                        float edgeFactor = (brightness - 0.48) / 0.12;
                        // Edge turns gold on hover
                        vec3 edgeHover = vec3(0.9, 0.60, 0.08) * 1.5;
                        edgeBase = mix(vec3(1.3), edgeHover, goldBlend);
                        sampledDiffuseColor.rgb = mix(sampledDiffuseColor.rgb, edgeBase, edgeFactor);
                      }

                      // ── COMPOSE final colour ───────────────────────────────
                      vec3 finalColor = baseColor;
                      // Blend dark-gold sweep on hover
                      finalColor = mix(finalColor, goldColor, goldBlend * goldMask);
                      // Layer sparkles & streaks ON TOP — always visible when hovering
                      finalColor = mix(finalColor, sparkColor,  goldBlend * totalSparkle * 1.1);
                      finalColor = mix(finalColor, streakColor, goldBlend * totalStreak  * 0.7);

                      sampledDiffuseColor.rgb = finalColor;
                      diffuseColor *= sampledDiffuseColor;
                    #endif
                    `,
                  );

                  /* ── emissive: golden glow + spark bloom ────────────── */
                  shader.fragmentShader = shader.fragmentShader.replace(
                    `#include <emissivemap_fragment>`,
                    /* glsl */`
                    #include <emissivemap_fragment>

                    // Gold sweep emissive glow
                    float eDist  = length(vMapUv - mouseUV);
                    float eSpot  = exp(-eDist * eDist * 7.0);
                    vec3  goldEmit = vec3(0.90, 0.52, 0.04) * eSpot * goldBlend * 0.50;

                    // Spark bloom — re-compute nearest spark distance
                    float nearestSpark = 99.0;
                    vec2 sparkC2[12];
                    sparkC2[0]  = vec2(${SPARK_POSITIONS[0].join(", ")});
                    sparkC2[1]  = vec2(${SPARK_POSITIONS[1].join(", ")});
                    sparkC2[2]  = vec2(${SPARK_POSITIONS[2].join(", ")});
                    sparkC2[3]  = vec2(${SPARK_POSITIONS[3].join(", ")});
                    sparkC2[4]  = vec2(${SPARK_POSITIONS[4].join(", ")});
                    sparkC2[5]  = vec2(${SPARK_POSITIONS[5].join(", ")});
                    sparkC2[6]  = vec2(${SPARK_POSITIONS[6].join(", ")});
                    sparkC2[7]  = vec2(${SPARK_POSITIONS[7].join(", ")});
                    sparkC2[8]  = vec2(${SPARK_POSITIONS[8].join(", ")});
                    sparkC2[9]  = vec2(${SPARK_POSITIONS[9].join(", ")});
                    sparkC2[10] = vec2(${SPARK_POSITIONS[10].join(", ")});
                    sparkC2[11] = vec2(${SPARK_POSITIONS[11].join(", ")});
                    for (int s2 = 0; s2 < 12; s2++) {
                      float sd2 = float(s2) * 1.618 + 0.37;
                      float tw2 = 0.5 + 0.5 * sin(uTime * (2.5 + sd2) + sd2 * 7.3);
                      float prx2 = exp(-length(sparkC2[s2] - mouseUV) * 4.0);
                      float dist2 = length(vMapUv - sparkC2[s2]);
                      float bloom = exp(-dist2 * dist2 * 200.0) * tw2 * prx2;
                      nearestSpark = min(nearestSpark, 1.0 - bloom);
                    }
                    float sparkBloom = 1.0 - clamp(nearestSpark, 0.0, 1.0);
                    vec3 sparkEmit = vec3(1.0, 0.90, 0.55) * sparkBloom * goldBlend * 0.8;

                    totalEmissiveRadiance = emissive * vec3(1.0) + goldEmit + sparkEmit;
                    `,
                  );
                }}
              />
            ) : (
              /* ── DEPTH LAYERS: purple → cyan gradient (unchanged) ── */
              <meshBasicMaterial
                map={texture}
                transparent={true}
                side={THREE.DoubleSide}
                depthWrite={true}
                onBeforeCompile={(shader) => {
                  shader.fragmentShader = shader.fragmentShader.replace(
                    `#include <map_fragment>`,
                    `
                    #ifdef USE_MAP
                      vec4 sampledDiffuseColor = texture2D( map, vMapUv );
                      if (vMapUv.x < 0.25 && vMapUv.y > 0.85) { discard; }
                      float brightness = dot(sampledDiffuseColor.rgb, vec3(0.299, 0.587, 0.114));
                      if (brightness > 0.6) { discard; }
                      vec3 gradientStart = vec3(0.486, 0.36, 1.0);
                      vec3 gradientEnd   = vec3(0.298, 0.878, 1.0);
                      vec3 gradientColor = mix(gradientStart, gradientEnd, vMapUv.x);
                      sampledDiffuseColor.rgb = mix(sampledDiffuseColor.rgb, gradientColor, 0.85);
                      sampledDiffuseColor.rgb *= 0.3;
                      diffuseColor *= sampledDiffuseColor;
                    #endif
                    `,
                  );
                }}
              />
            )}
          </mesh>
        ))}
      </group>
    </group>
  );
}
