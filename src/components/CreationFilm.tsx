import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import { Globe, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Pacing of the seven-stage reel, in milliseconds. */
const DURATIONS = [1100, 1200, 1700, 1700, 1500, 2200, 3600];

type Phase = "hidden" | "outline" | "filled" | "recede";

function phaseFor(stage: number): Phase {
  if (stage <= 1) return "hidden";
  if (stage === 2) return "outline";
  if (stage <= 5) return "filled";
  return "recede";
}

const FOREGROUND = "245,245,247";
const MUTED = "146,149,166";
const PRIMARY = "124,92,255";
const CYAN = "76,224,255";
const GOLD = "255,197,107";

function lineVariants(rgb: string) {
  return {
    hidden: { opacity: 0, scaleX: 0.3, backgroundColor: `rgba(${rgb},0)`, borderColor: "rgba(255,255,255,0)" },
    outline: { opacity: 1, scaleX: 1, backgroundColor: `rgba(${rgb},0)`, borderColor: `rgba(${CYAN},0.45)` },
    filled: { opacity: 1, scaleX: 1, backgroundColor: `rgba(${rgb},0.85)`, borderColor: `rgba(${rgb},0.85)` },
    recede: { opacity: 1, scaleX: 1, backgroundColor: `rgba(${rgb},0.85)`, borderColor: `rgba(${rgb},0.85)` },
  };
}

function cardVariants(rgb: string) {
  return {
    hidden: { opacity: 0, scale: 0.85, backgroundColor: "rgba(255,255,255,0)", borderColor: "rgba(255,255,255,0)" },
    outline: { opacity: 1, scale: 1, backgroundColor: "rgba(255,255,255,0)", borderColor: `rgba(${rgb},0.35)` },
    filled: { opacity: 1, scale: 1, backgroundColor: `rgba(${rgb},0.12)`, borderColor: `rgba(${rgb},0.3)` },
    recede: { opacity: 1, scale: 1, backgroundColor: `rgba(${rgb},0.12)`, borderColor: `rgba(${rgb},0.3)` },
  };
}

const iconVariants = {
  hidden: { opacity: 0 },
  outline: { opacity: 0 },
  filled: { opacity: 1 },
  recede: { opacity: 1 },
};

const mockupVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96, boxShadow: "0 0px 0px rgba(0,0,0,0)" },
  outline: { opacity: 1, y: 0, scale: 1, boxShadow: "0 0px 0px rgba(0,0,0,0)" },
  filled: { opacity: 1, y: 0, scale: 1, boxShadow: "0 30px 80px -30px rgba(124,92,255,0.35)" },
  recede: { opacity: 0.14, y: 0, scale: 0.85, boxShadow: "0 30px 80px -30px rgba(124,92,255,0.1)" },
};

const chipVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0 },
  recede: { opacity: 0.12, scale: 0.85, y: 0 },
};

export function CreationFilm({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);

  const rotateX = useSpring(0, { stiffness: 60, damping: 18 });
  const rotateY = useSpring(0, { stiffness: 60, damping: 18 });
  const lightX = useMotionValue(50);
  const lightY = useMotionValue(50);
  const lightBg = useMotionTemplate`radial-gradient(480px circle at ${lightX}% ${lightY}%, rgba(124,92,255,0.16), transparent 70%)`;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setStage(6);
      return;
    }
    let timeout: ReturnType<typeof setTimeout>;
    const tick = (current: number) => {
      timeout = setTimeout(() => {
        const next = (current + 1) % DURATIONS.length;
        setStage(next);
        tick(next);
      }, DURATIONS[current]);
    };
    tick(0);
    return () => clearTimeout(timeout);
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 6);
    rotateX.set((0.5 - py) * 6);
    lightX.set(px * 100);
    lightY.set(py * 100);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    lightX.set(50);
    lightY.set(50);
  };

  const phase = phaseFor(stage);
  const chipPhase = stage === 5 ? "visible" : stage === 6 ? "recede" : "hidden";

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-white/8 bg-gradient-to-br from-surface-2 via-surface to-void",
        className
      )}
    >
      {/* Digital-space dot grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)", backgroundSize: "26px 26px" }}
        aria-hidden="true"
      />

      {/* Ambient lighting that shifts through the narrative: origin -> tech -> growth */}
      <motion.div
        className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full blur-[90px]"
        style={{ background: `radial-gradient(circle, rgba(${PRIMARY},0.6), transparent 70%)` }}
        animate={{ opacity: stage >= 1 ? 0.35 : 0.1 }}
        transition={{ duration: 1.4, ease: EASE }}
        aria-hidden="true"
      />
      <motion.div
        className="pointer-events-none absolute -right-20 top-1/3 h-72 w-72 rounded-full blur-[100px]"
        style={{ background: `radial-gradient(circle, rgba(${CYAN},0.5), transparent 70%)` }}
        animate={{ opacity: stage >= 3 ? 0.3 : 0.08 }}
        transition={{ duration: 1.4, ease: EASE }}
        aria-hidden="true"
      />
      <motion.div
        className="pointer-events-none absolute -bottom-20 left-1/4 h-64 w-64 rounded-full blur-[100px]"
        style={{ background: `radial-gradient(circle, rgba(${GOLD},0.5), transparent 70%)` }}
        animate={{ opacity: stage >= 5 ? 0.3 : 0.06 }}
        transition={{ duration: 1.4, ease: EASE }}
        aria-hidden="true"
      />

      {/* Mouse-reactive light */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: lightBg }} aria-hidden="true" />

      {/* Perspective stage */}
      <div className="relative flex h-full items-center justify-center p-8 sm:p-12" style={{ perspective: 1000 }}>
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative flex w-full items-center justify-center"
        >
          {/* Stage 1 — a single blueprint line appears */}
          <svg
            className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
            viewBox="0 0 400 300"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <motion.line
              x1="40"
              y1="150"
              x2="360"
              y2="150"
              stroke="#4ce0ff"
              strokeWidth={1.5}
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 6px rgba(76,224,255,0.8))" }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: stage >= 1 ? 1 : 0,
                opacity: stage === 1 ? 1 : 0,
              }}
              transition={{ duration: stage === 1 ? 1 : 0.6, ease: EASE }}
            />
          </svg>

          {/* Stages 2-6 — wireframe, UI, premium site, growth, convergence */}
          <motion.div
            variants={mockupVariants}
            animate={phase}
            transition={{ duration: 1, ease: EASE }}
            className="relative w-full max-w-[22rem] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm"
            style={{ transform: "translateZ(30px)" }}
          >
            {/* Premium sheen sweep */}
            <motion.div
              className="pointer-events-none absolute inset-0 z-20"
              style={{ background: "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.16) 50%, transparent 65%)" }}
              initial={{ x: "-120%" }}
              animate={{ x: stage === 4 ? "120%" : "-120%" }}
              transition={{ duration: stage === 4 ? 1.3 : 0, ease: EASE }}
            />

            {/* Browser top bar */}
            <div className="relative z-10 flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <motion.div
                variants={lineVariants(MUTED)}
                style={{ originX: 0 }}
                className="ml-3 h-2 max-w-[8rem] flex-1 rounded-full border"
              />
            </div>

            {/* Body */}
            <div className="relative z-10 grid gap-3 p-5">
              <motion.div variants={lineVariants(FOREGROUND)} style={{ originX: 0 }} className="h-3.5 w-3/5 rounded-md border" />
              <motion.div variants={lineVariants(MUTED)} style={{ originX: 0 }} className="h-2 w-2/5 rounded-md border" />
              <motion.div
                variants={lineVariants(PRIMARY)}
                style={{ originX: 0 }}
                className="mt-1 h-8 w-28 rounded-full border"
              />

              <div className="mt-2 grid grid-cols-3 gap-2.5">
                <motion.div variants={cardVariants(PRIMARY)} className="relative flex h-16 items-center justify-center rounded-xl border">
                  <motion.div variants={iconVariants}>
                    <Globe className="h-3.5 w-3.5 text-primary-2" />
                  </motion.div>
                </motion.div>

                <motion.div variants={cardVariants(CYAN)} className="relative flex h-16 items-center justify-center rounded-xl border">
                  <svg viewBox="0 0 64 32" className="h-8 w-12 overflow-visible">
                    <motion.path
                      d="M2 26 L14 18 L26 20 L40 8 L62 4"
                      fill="none"
                      stroke="#4ce0ff"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: stage >= 5 ? 1 : 0 }}
                      transition={{ duration: stage === 5 ? 1.6 : 0.4, ease: EASE }}
                    />
                  </svg>
                </motion.div>

                <motion.div variants={cardVariants(GOLD)} className="relative flex h-16 items-center justify-center rounded-xl border">
                  <motion.div variants={iconVariants}>
                    <Users className="h-3.5 w-3.5 text-gold" />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Stage 6 — growth signals converge around the live site */}
          <motion.div
            variants={chipVariants}
            animate={chipPhase}
            transition={{ duration: 0.8, ease: EASE }}
            className="glass absolute -top-5 right-2 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs sm:right-6"
            style={{ transform: "translateZ(60px)" }}
          >
            <span className="signature-dot" />
            <span className="text-foreground/90">Traffic <span className="text-cyan">+248%</span></span>
          </motion.div>

          <motion.div
            variants={chipVariants}
            animate={chipPhase}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="glass absolute left-2 top-1/2 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs sm:left-0"
            style={{ transform: "translateZ(60px)" }}
          >
            <span className="signature-dot" />
            <span className="text-foreground/90">Engagement <span className="text-primary-2">+180%</span></span>
          </motion.div>

          <motion.div
            variants={chipVariants}
            animate={chipPhase}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="glass absolute -bottom-5 left-1/2 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs"
            style={{ transform: "translateZ(60px)" }}
          >
            <span className="signature-dot" />
            <span className="text-foreground/90">Leads <span className="text-gold">3.2x</span></span>
          </motion.div>

          {/* Stage 7 — everything converges and reveals DNTWeb */}
          <AnimatePresence>
            {stage === 6 && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, scale: 0.92, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -8 }}
                transition={{ duration: 1, ease: EASE }}
                className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 text-center"
                style={{ transform: "translateZ(90px)" }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="signature-dot" />
                  <span className="font-display text-3xl font-semibold tracking-tight text-gradient-signature sm:text-4xl">
                    DNTWeb
                  </span>
                </div>
                <div className="flex items-center gap-3 font-display text-lg font-medium text-foreground/90 sm:text-xl">
                  {["Build.", "Launch.", "Grow."].map((word, i) => (
                    <motion.span
                      key={word}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.18, duration: 0.6, ease: EASE }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
