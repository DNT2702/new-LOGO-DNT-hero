import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { portfolioItems } from "@/data/portfolio";
import { LinkButton } from "@/components/Button";

export function ProjectDetails() {
  const { slug } = useParams();
  const project = portfolioItems.find((p) => p.slug === slug);

  if (!project) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-10 text-center">
        <h1 className="font-display text-4xl font-bold">Project Not Found</h1>
        <p className="mt-4 text-muted">The work you are looking for doesn't exist.</p>
        <LinkButton href="/" variant="primary" className="mt-8">
          Return Home
        </LinkButton>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen pt-32 pb-24">
      {/* Dynamic Background Gradient */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-20 transition-opacity duration-1000"
        style={{ background: project.gradient }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void via-void/90 to-void" />

      <div className="container-px relative mx-auto max-w-5xl">
        {/* Back Link */}
        <Link 
          to="/#portfolio" 
          className="group mb-12 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-white"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-transform group-hover:-translate-x-1">
            <ArrowLeft className="h-4 w-4" />
          </div>
          Back to Portfolio
        </Link>

        {/* Header */}
        <header className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center gap-4"
          >
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-cyan">
              {project.category}
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 font-display text-5xl font-bold leading-[1.1] tracking-tight sm:text-7xl"
          >
            {project.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-2xl text-xl text-muted"
          >
            {project.description}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-2"
          >
            {project.tags.map((tag) => (
              <span key={tag} className="glass rounded-full px-4 py-1.5 text-sm text-foreground">
                {tag}
              </span>
            ))}
          </motion.div>
        </header>

        {/* Content */}
        <div className="grid gap-16 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="font-display text-3xl font-semibold">The Challenge</h2>
              <p className="mt-6 leading-relaxed text-muted sm:text-lg">
                {project.challenge}
              </p>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-3xl font-semibold">The Solution</h2>
              <p className="mt-6 leading-relaxed text-muted sm:text-lg">
                {project.solution}
              </p>
            </motion.section>
          </div>

          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-strong rounded-3xl p-8"
            >
              <h3 className="font-display text-2xl font-semibold">Key Results</h3>
              <ul className="mt-6 space-y-4">
                {project.results.map((result, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-cyan" />
                    <span className="text-muted">{result}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Next Project / CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-32 text-center"
        >
          <h2 className="font-display text-4xl font-semibold">Ready to scale your business?</h2>
          <div className="mt-8">
            <LinkButton href="/#contact" variant="primary">
              Start Your Project
            </LinkButton>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
