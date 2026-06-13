import { motion } from "motion/react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { resultStats } from "@/data/results";

export function Results() {
  return (
    <section className="relative py-28 sm:py-36">
      <div className="container-px mx-auto">
        <div className="glass-strong relative overflow-hidden rounded-[2.5rem] px-6 py-16 sm:px-12">
          <div className="signature-divider absolute inset-x-0 top-0" />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[140px]"
            style={{ background: "radial-gradient(circle, rgba(124,92,255,0.5), transparent 70%)" }}
          />
          <div
            className="pointer-events-none absolute -right-24 -bottom-24 h-[26rem] w-[26rem] rounded-full opacity-25 blur-[120px]"
            style={{ background: "radial-gradient(circle, rgba(255,197,107,0.4), transparent 70%)" }}
          />

          <div className="relative z-10 grid grid-cols-2 gap-10 sm:grid-cols-4">
            {resultStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <div className="font-display text-4xl font-semibold text-gradient sm:text-6xl">
                  <AnimatedCounter to={stat.value} suffix={stat.suffix} duration={2} />
                </div>
                <div className="mt-3 text-xs uppercase tracking-widest text-muted sm:text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
