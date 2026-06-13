import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { TextReveal } from "@/components/TextReveal";
import { PortfolioCard } from "@/components/PortfolioCard";
import { portfolioItems } from "@/data/portfolio";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function Portfolio() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const getDistance = () => track.scrollWidth - section.offsetWidth;

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getDistance()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section id="portfolio" ref={sectionRef} className="relative overflow-hidden py-28 sm:py-36 lg:py-0 lg:min-h-screen lg:flex lg:items-center">
      <div
        ref={trackRef}
        className="flex flex-col gap-6 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-8 lg:pl-[6vw]"
      >
        <div className="container-px shrink-0 lg:w-[35vw] lg:px-0">
          <div className="mb-3 inline-flex items-center gap-2.5 rounded-full border border-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-cyan">
            <span className="signature-dot" />
            Selected Work
          </div>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.1] tracking-tight">
            <TextReveal text="Work That Speaks For Itself" />
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 max-w-md text-base text-muted sm:text-lg"
          >
            A selection of projects where premium design met measurable business impact.
          </motion.p>
          <p className="mt-8 hidden text-sm text-muted lg:block">Scroll to explore →</p>
        </div>

        <div className="container-px flex flex-col gap-6 lg:flex-row lg:gap-8 lg:px-0">
          {portfolioItems.map((item) => (
            <PortfolioCard key={item.title} item={item} />
          ))}
          <div className="hidden h-[65vh] w-[10vw] shrink-0 lg:block" />
        </div>
      </div>
    </section>
  );
}
