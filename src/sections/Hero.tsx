import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ArrowDown, Sparkles } from "lucide-react";
import { TextReveal } from "@/components/TextReveal";
import { Typewriter } from "@/components/Typewriter";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { LinkButton } from "@/components/Button";
import { CreationFilm } from "@/components/CreationFilm";

const stats = [
  { value: 120, suffix: "+", label: "Projects Delivered" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
  { value: 4, suffix: "x", label: "Avg. Speed Boost" },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  return (
    <section ref={sectionRef} id="home" className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-void">
      {/* The hero is its own dark digital space — opaque so the global universe only appears once the story scrolls into the next world */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.05]"
        style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-[1]"
        style={{ background: "radial-gradient(55% 50% at 18% 28%, rgba(124,92,255,0.14), transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-[1]"
        style={{ background: "radial-gradient(50% 50% at 88% 85%, rgba(76,224,255,0.08), transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="container-px relative z-10 mx-auto w-full pt-28">
        <motion.div
          className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12"
          style={{ opacity: contentOpacity, y: contentY, scale: contentScale }}
        >
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium tracking-widest text-muted uppercase"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan" />
              Premium Web Design &amp; Development Agency
            </motion.div>

            <div className="relative">
              <div
                className="pointer-events-none absolute -inset-x-10 -inset-y-16 -z-10 opacity-60 blur-[80px]"
                style={{ background: "radial-gradient(60% 60% at 30% 50%, rgba(124,92,255,0.25), transparent 70%)" }}
                aria-hidden="true"
              />
              <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-[1.05] tracking-tight">
                <TextReveal text="We Build Digital Experiences" className="block" immediate />
                <TextReveal text="That Drive Business Growth" className="block text-gradient" delay={0.3} immediate />
              </h1>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-6 max-w-xl text-base text-muted sm:text-lg"
            >
              <Typewriter
                text="Custom Websites, Web Applications, Automation Systems and AI Solutions Built For Modern Businesses."
                delay={1100}
                speed={18}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <LinkButton href="#contact" variant="primary" icon={<ArrowRight className="h-4 w-4" />}>
                Start Your Project
              </LinkButton>
              <LinkButton href="#portfolio" variant="secondary">
                View Our Work
              </LinkButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mt-16 max-w-md"
            >
              <div className="signature-divider mb-8" />
              <div className="flex flex-wrap gap-10 sm:gap-16">
                {stats.map((stat, i) => (
                  <div key={stat.label} className={i > 0 ? "border-l border-white/8 pl-10 sm:pl-16" : undefined}>
                    <div className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
                      <AnimatedCounter to={stat.value} suffix={stat.suffix} duration={2} immediate />
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-widest text-muted">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="order-first lg:order-none"
          >
            <CreationFilm className="h-[22rem] w-full sm:h-[26rem] lg:h-[34rem]" />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-muted"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <ArrowDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
