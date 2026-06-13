import { Suspense, lazy } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Magnetic } from "@/components/MagneticButton";
import { TextReveal } from "@/components/TextReveal";
import { LinkButton } from "@/components/Button";
import { ParticleField } from "@/components/ParticleField";
import { Parallax } from "@/components/Parallax";

const MiniOrb = lazy(() => import("@/components/three/MiniOrb").then((m) => ({ default: m.MiniOrb })));

const columns = [
  {
    title: "Services",
    links: ["Website Development", "E-Commerce", "Web Applications", "AI Integrations", "Automation"],
  },
  {
    title: "Company",
    links: ["Why DNT", "Our Work", "Process", "Testimonials", "Contact"],
  },
  {
    title: "Connect",
    links: ["hello@dntweb.com", "WhatsApp", "LinkedIn", "Instagram", "X (Twitter)"],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden pt-20">
      <div className="signature-divider absolute inset-x-0 top-0" />
      <ParticleField className="absolute inset-0 h-full w-full opacity-40" density={70} color="76,224,255" />

      <Parallax speed={50} className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full opacity-25 blur-[160px]"
          style={{ background: "radial-gradient(circle, rgba(124,92,255,0.35), transparent 70%)" }}
        />
      </Parallax>
      <Parallax speed={35} className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute right-[-12%] bottom-[-15%] h-[32rem] w-[32rem] rounded-full opacity-25 blur-[150px]"
          style={{ background: "radial-gradient(circle, rgba(255,197,107,0.3), transparent 70%)" }}
        />
      </Parallax>

      <div className="container-px relative z-10 mx-auto">
        {/* Big CTA */}
        <div className="flex flex-col items-center gap-10 border-b border-white/8 pb-16 text-center lg:flex-row lg:justify-between lg:text-left">
          <div className="max-w-xl">
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-tight tracking-tight">
              <TextReveal text="Ready To Build Something" className="block" />
              <TextReveal text="Extraordinary?" className="block text-gradient" delay={0.15} />
            </h2>
            <p className="mt-4 max-w-md text-sm text-muted sm:text-base">
              Let's turn your idea into a fast, beautiful, high-converting digital product.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Suspense fallback={null}>
              <div className="hidden h-24 w-24 shrink-0 sm:block">
                <MiniOrb shape="icosahedron" colorA="#7c5cff" colorB="#4ce0ff" />
              </div>
            </Suspense>
            <LinkButton href="#contact" variant="primary" icon={<ArrowUpRight className="h-4 w-4" />}>
              Start Your Project
            </LinkButton>
          </div>
        </div>

        <div className="flex flex-col gap-12 py-16 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <a href="#home" className="flex items-center gap-2" data-cursor-hover>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan font-display text-base font-bold text-void shadow-[0_0_16px_rgba(124,92,255,0.5)]">
                D
              </span>
              <span className="font-display text-lg font-semibold tracking-tight">DNT Web</span>
            </a>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              We build digital experiences that drive business growth — custom websites, web
              applications, automation systems and AI solutions for modern businesses.
            </p>
            <Magnetic strength={0.3} className="mt-6">
              <a
                href="#contact"
                data-cursor-hover
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-cyan px-5 py-2.5 text-sm font-semibold text-void transition-shadow hover:shadow-[0_0_30px_rgba(124,92,255,0.4)]"
              >
                Get a Free Estimate
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Magnetic>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:gap-20">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-muted">{col.title}</h4>
                <ul className="mt-4 flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        data-cursor-hover
                        className="group inline-flex items-center gap-1.5 text-sm text-foreground/80 transition-colors hover:text-cyan"
                      >
                        {link}
                        <ArrowRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/8 py-8 text-xs text-muted sm:flex-row">
          <span>© {new Date().getFullYear()} DNT Web. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <a href="#" data-cursor-hover className="transition-colors hover:text-foreground">Privacy Policy</a>
            <a href="#" data-cursor-hover className="transition-colors hover:text-foreground">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
