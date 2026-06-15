import { useRef } from "react";
import type { MouseEvent } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { PortfolioItem } from "@/data/portfolio";

export function PortfolioCard({ item }: { item: PortfolioItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const shineOpacity = useSpring(0, { damping: 24, stiffness: 200 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width) * 100);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 100);
    shineOpacity.set(1);
  };

  const handleMouseLeave = () => {
    shineOpacity.set(0);
  };

  const shine = useMotionTemplate`radial-gradient(420px circle at ${mouseX}% ${mouseY}%, rgba(255,255,255,0.18), transparent 60%)`;

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(`/work/${item.slug}`)}
      data-cursor="view"
      className="group relative h-[60vh] w-[85vw] shrink-0 cursor-pointer overflow-hidden rounded-3xl border border-white/8 shadow-[0_30px_70px_-28px_rgba(0,0,0,0.7)] sm:w-[70vw] lg:h-[65vh] lg:w-[55vw]"
    >
      <div
        className="absolute inset-0 scale-105 opacity-70 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100"
        style={{ background: item.gradient }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-void/10" />

      {/* Holographic scanlines */}
      <div className="scanlines pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Cursor-tracked shine sweep */}
      <motion.div
        className="pointer-events-none absolute inset-0 mix-blend-overlay"
        style={{ background: shine, opacity: shineOpacity }}
      />

      <div className="relative z-10 flex h-full flex-col justify-between p-8 sm:p-10">
        <div className="flex items-center justify-between">
          <span className="glass rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-foreground">
            {item.category}
          </span>
          <div className="flex h-12 w-12 items-center justify-center rounded-full glass transition-all duration-500 group-hover:rotate-45 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-cyan">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>

        <div className="max-w-lg translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
          <h3 className="font-display text-3xl font-semibold sm:text-4xl lg:text-5xl">{item.title}</h3>
          <p className="mt-4 text-sm leading-relaxed text-muted opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:text-base">
            {item.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span key={tag} className="glass rounded-full px-3 py-1 text-xs text-muted">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
