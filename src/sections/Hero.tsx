import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, Sparkles } from "lucide-react";
import { TextReveal } from "@/components/TextReveal";
import { LinkButton } from "@/components/Button";
import { Hero3DCanvas } from "@/components/three/Hero3DCanvas";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  return (
    <section ref={sectionRef} id="home" className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-void">
      {/* 3D Canvas layer behind text but interactive */}
      <Hero3DCanvas />

      {/* Optional grid overlay for the digital network effect */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        aria-hidden="true"
      />
      
      {/* Vignette gradients removed as they created a visible oval structure over the 3D logo */}

      <div className="container-px relative z-10 mx-auto w-full pt-32 pb-24 pointer-events-none flex flex-col justify-center">
        <motion.div
          className="flex flex-col items-start max-w-3xl text-left"
          style={{ opacity: contentOpacity, y: contentY, scale: contentScale }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="glass mb-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-medium tracking-widest text-cyan uppercase shadow-[0_0_15px_rgba(0,200,255,0.3)] pointer-events-auto"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan" />
            Premium Web Design &amp; Development
          </motion.div>

          <div className="relative mb-8">
            <h1 className="font-display text-[clamp(2.5rem,5.5vw,5rem)] font-semibold leading-[1.1] tracking-tight text-white drop-shadow-2xl">
              <TextReveal text="Building Digital Experiences" className="block" immediate />
              <TextReveal text="That Move Businesses Forward" className="block text-gradient" delay={0.3} immediate />
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="max-w-xl text-base text-muted/90 sm:text-lg mb-12"
          >
            Custom Websites, Web Applications, Automation Systems and AI Solutions Built For Modern Businesses.
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-start gap-6 pointer-events-auto"
          >
            <LinkButton href="#contact" variant="primary" className="shadow-[0_0_25px_rgba(124,92,255,0.5)]">
              Start Your Project
            </LinkButton>
            <LinkButton href="#portfolio" variant="secondary" className="glass bg-white/5 border-white/10 hover:bg-white/10">
              View Our Work
            </LinkButton>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-muted"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-cyan/70">Scroll</span>
          <ArrowDown className="h-4 w-4 text-cyan/70" />
        </motion.div>
      </motion.div>
    </section>
  );
}
