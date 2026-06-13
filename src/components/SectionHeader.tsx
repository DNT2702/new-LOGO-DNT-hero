import { motion } from "motion/react";
import { TextReveal } from "@/components/TextReveal";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({ eyebrow, title, description, align = "left", className }: SectionHeaderProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-cyan"
      >
        <span className="signature-dot" />
        {eyebrow}
      </motion.div>
      <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.1] tracking-tight">
        <TextReveal text={title} />
      </h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-base text-muted sm:text-lg"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
