import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { SectionHeader } from "@/components/SectionHeader";
import { Parallax } from "@/components/Parallax";
import { processSteps } from "@/data/process";
import { cn } from "@/lib/utils";

export function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.5"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="process" className="relative overflow-hidden py-28 sm:py-36">
      <Parallax speed={90} className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute right-[-10%] top-1/3 h-[34rem] w-[34rem] rounded-full opacity-25 blur-[140px]"
          style={{ background: "radial-gradient(circle, rgba(124,92,255,0.3), transparent 70%)" }}
        />
      </Parallax>
      <div className="container-px relative mx-auto">
        <SectionHeader
          eyebrow="How We Work"
          title="A Process Built For Results"
          description="Five focused stages take your project from idea to a live, high-performing product."
          align="center"
          className="mx-auto"
        />

        <div ref={containerRef} className="relative mx-auto mt-20 max-w-4xl">
          {/* Track */}
          <div className="absolute left-5 top-0 h-full w-px bg-white/8 sm:left-1/2" />
          {/* Animated progress line */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-5 top-0 w-px bg-gradient-to-b from-primary via-cyan to-transparent shadow-[0_0_12px_rgba(124,92,255,0.6)] sm:left-1/2"
          />

          <div className="flex flex-col gap-12 sm:gap-16">
            {processSteps.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={step.number} className="grid grid-cols-1 sm:grid-cols-2 sm:gap-12">
                  {/* Spacer for alternating layout on desktop */}
                  {!isEven && <div className="hidden sm:block" />}

                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-15% 0px" }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className={cn("relative pl-14 sm:pl-0", isEven ? "sm:text-right sm:pr-12" : "sm:pl-12")}
                  >
                    {/* Node */}
                    <span
                      className={cn(
                        "absolute top-2 left-5 -translate-x-1/2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan ring-4 ring-void",
                        isEven ? "sm:left-auto sm:right-0 sm:translate-x-1/2" : "sm:left-0 sm:-translate-x-1/2"
                      )}
                    />

                    <div className="glass relative overflow-hidden rounded-3xl p-6 transition-colors duration-300 hover:border-white/20 sm:p-8">
                      <span className="pointer-events-none absolute bottom-2 right-5 font-display text-6xl font-semibold text-white/[0.04]">
                        {step.number}
                      </span>
                      <span className="font-mono text-sm text-cyan">{step.number}</span>
                      <h3 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{step.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{step.description}</p>
                    </div>
                  </motion.div>

                  {isEven && <div className="hidden sm:block" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
