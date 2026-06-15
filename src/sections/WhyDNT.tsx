import { motion } from "motion/react";
import { X, Check } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { Parallax } from "@/components/Parallax";
import { comparisonRows } from "@/data/comparison";

export function WhyDNT() {
  return (
    <section id="why-dnt" className="relative overflow-hidden py-28 sm:py-36">
      <Parallax speed={70} className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute left-1/2 top-0 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full opacity-30 blur-[140px]"
          style={{ background: "radial-gradient(circle, rgba(76,224,255,0.25), transparent 70%)" }}
        />
      </Parallax>
      <div className="container-px relative mx-auto">
        <SectionHeader
          eyebrow="Why DNT Web"
          title="A Different Kind of Agency"
          description="Most agencies slow you down with process and templates. We move fast, build custom, and stay focused on your business outcomes."
          align="center"
          className="mx-auto"
        />

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Traditional Agencies */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl border border-white/8 bg-white/[0.015] p-6 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.6)] sm:p-10"
          >
            <h3 className="font-display text-2xl font-semibold text-white/90">Traditional Agencies</h3>
            <div className="mt-8 flex flex-col gap-4">
              {comparisonRows.map((row, i) => (
                <motion.div
                  key={row.traditional}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/5">
                    <X className="h-3.5 w-3.5 text-white/70" />
                  </span>
                  <span className="text-sm text-white/90">{row.traditional}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* DNT Web */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="glass-strong relative overflow-hidden rounded-3xl p-6 shadow-[0_0_60px_rgba(124,92,255,0.15)] sm:p-10"
          >
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-40 blur-[100px]"
              style={{ background: "radial-gradient(circle, rgba(124,92,255,0.6), transparent 70%)" }}
            />
            <div
              className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full opacity-25 blur-[100px]"
              style={{ background: "radial-gradient(circle, rgba(255,197,107,0.5), transparent 70%)" }}
            />
            <h3 className="font-display text-2xl font-semibold text-gradient-signature">DNT Web</h3>
            <div className="mt-8 flex flex-col gap-4">
              {comparisonRows.map((row, i) => (
                <motion.div
                  key={row.dnt}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 + 0.1 }}
                  className="relative z-10 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan">
                    <Check className="h-3.5 w-3.5 text-void" strokeWidth={3} />
                  </span>
                  <span className="text-sm text-foreground">{row.dnt}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
