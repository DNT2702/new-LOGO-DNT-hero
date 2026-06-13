import { Suspense, lazy, useRef } from "react";
import type { MouseEvent } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import type { Service } from "@/data/services";

const MiniOrb = lazy(() => import("@/components/three/MiniOrb").then((m) => ({ default: m.MiniOrb })));

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const rotateX = useSpring(0, { damping: 20, stiffness: 200 });
  const rotateY = useSpring(0, { damping: 20, stiffness: 200 });
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 14);
    rotateX.set((0.5 - py) * 14);
    mouseX.set(px * 100);
    mouseY.set(py * 100);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const background = useMotionTemplate`radial-gradient(280px circle at ${mouseX}% ${mouseY}%, color-mix(in srgb, ${service.colorA} 22%, transparent), transparent 70%)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        data-cursor-hover
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          boxShadow: "0 20px 50px -24px rgba(0,0,0,0.6), inset 0 1px 0 0 rgba(255,255,255,0.05)",
        }}
        className="group relative h-full overflow-hidden rounded-3xl border border-white/8 bg-white/[0.02] p-7 transition-[border-color,box-shadow] duration-300 hover:border-white/15 hover:shadow-[0_28px_64px_-24px_rgba(0,0,0,0.7)]"
      >
        <motion.div className="pointer-events-none absolute inset-0" style={{ background }} />

        <span className="pointer-events-none absolute right-5 top-4 font-display text-5xl font-semibold text-white/[0.04]">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div
          style={{ transform: "translateZ(40px)" }}
          className="relative z-10 flex h-full flex-col"
        >
          <div className="mb-6 h-14 w-14 transition-transform duration-500 group-hover:scale-110">
            <Suspense fallback={<div className="h-full w-full rounded-2xl bg-gradient-to-br from-primary/20 to-cyan/20 ring-1 ring-white/10" />}>
              <MiniOrb shape={service.shape} colorA={service.colorA} colorB={service.colorB} />
            </Suspense>
          </div>

          <h3 className="font-display text-xl font-semibold text-foreground">{service.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">{service.description}</p>

          <div className="mt-6 flex items-center gap-1 text-sm font-medium text-primary-2 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
            Learn more <span aria-hidden>→</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
