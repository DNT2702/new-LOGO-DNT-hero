import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Magnetic } from "@/components/MagneticButton";
import { TextReveal } from "@/components/TextReveal";
import { LinkButton } from "@/components/Button";
import { ParticleField } from "@/components/ParticleField";
import { Parallax } from "@/components/Parallax";

import { MiniOrb } from "@/components/three/MiniOrb";

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
    links: ["dntweb2702@gmail.com", "WhatsApp", "LinkedIn", "Instagram", "X (Twitter)"],
  },
];

const getLinkHref = (link: string): string => {
  switch (link) {
    // Services
    case "Website Development":
      return "/work/solace-studio";
    case "E-Commerce":
      return "/work/lumora-skincare";
    case "Web Applications":
      return "/work/northpeak-capital";
    case "AI Integrations":
      return "/work/verve-fitness";
    case "Automation":
      return "/work/atlas-logistics";
    
    // Company
    case "Why DNT":
      return "/#why-dnt";
    case "Our Work":
      return "/#portfolio";
    case "Process":
      return "/#process";
    case "Testimonials":
      return "/#testimonials";
    case "Contact":
      return "/#contact";

    // Connect
    case "dntweb2702@gmail.com":
      return "mailto:dntweb2702@gmail.com";
    case "WhatsApp":
      return "https://wa.me/yournumber";
    case "LinkedIn":
      return "https://linkedin.com/company/yourcompany";
    case "Instagram":
      return "https://instagram.com/yourhandle";
    case "X (Twitter)":
      return "https://x.com/yourhandle";

    default:
      return "/";
  }
};

export function Footer() {
  const bubbles = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 12 + 6,
      left: Math.random() * 80 + 10,
      delay: Math.random() * 8,
      duration: Math.random() * 12 + 15,
      opacity: Math.random() * 0.12 + 0.08,
      xOffset1: Math.random() * 12 - 6,
      xOffset2: Math.random() * 12 - 6,
    }));
  }, []);

  return (
    <footer className="relative overflow-hidden pt-20">
      <div className="signature-divider absolute inset-x-0 top-0" />
      <ParticleField className="absolute inset-0 h-full w-full opacity-40" density={70} color="76,224,255" />

      {/* Decorative floating glassmorphic orbs in the background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-[2]">
        {/* Orb 1: Cyan, floating slowly */}
        <motion.div 
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[15%] top-[25%] h-36 w-36 rounded-full bg-gradient-to-br from-cyan/20 to-transparent blur-2xl opacity-40"
        />
        {/* Orb 2: Purple, floating with offset */}
        <motion.div 
          animate={{
            y: [0, 40, 0],
            x: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[20%] top-[10%] h-48 w-48 rounded-full bg-gradient-to-br from-primary/15 to-transparent blur-3xl opacity-35"
        />
        {/* Orb 3: Gold/Yellow, floating near the CTA */}
        <motion.div 
          animate={{
            y: [0, -25, 0],
            x: [0, -15, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
          className="absolute left-[40%] bottom-[30%] h-28 w-28 rounded-full bg-gradient-to-br from-gold/15 to-transparent blur-2xl opacity-30"
        />
        
        {/* Floating Bubble Particles */}
        {bubbles.map((b) => (
          <motion.div
            key={b.id}
            initial={{ y: "110%", x: `${b.left}%`, scale: 0.7 }}
            animate={{
              y: "-10%",
              x: [
                `${b.left}%`,
                `${b.left + b.xOffset1}%`,
                `${b.left + b.xOffset2}%`,
                `${b.left}%`
              ],
              scale: [0.7, 1.3, 0.9, 0.7],
            }}
            transition={{
              duration: b.duration,
              repeat: Infinity,
              ease: "linear",
              delay: b.delay,
            }}
            className="absolute rounded-full border border-white/10 bg-gradient-to-br from-white/10 to-cyan/10 shadow-[0_0_10px_rgba(76,224,255,0.12)]"
            style={{
              width: b.size,
              height: b.size,
              opacity: b.opacity,
            }}
          />
        ))}
      </div>

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
              <div className="hidden h-24 w-24 shrink-0 sm:block">
                <MiniOrb shape="icosahedron" colorA="#7c5cff" colorB="#4ce0ff" eager />
              </div>
            <LinkButton href="/#contact" variant="primary" icon={<ArrowUpRight className="h-4 w-4" />}>
              Start Your Project
            </LinkButton>
          </div>
        </div>

        <div className="flex flex-col gap-12 py-16 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <Link to="/" className="flex items-center gap-2" data-cursor-hover>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan font-display text-base font-bold text-void shadow-[0_0_16px_rgba(124,92,255,0.5)]">
                D
              </span>
              <span className="font-display text-lg font-semibold tracking-tight">DNT Web</span>
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              We build digital experiences that drive business growth — custom websites, web
              applications, automation systems and AI solutions for modern businesses.
            </p>
            <Magnetic strength={0.3} className="mt-6">
              <Link
                to="/#contact"
                data-cursor-hover
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-cyan px-5 py-2.5 text-sm font-semibold text-void transition-shadow hover:shadow-[0_0_30px_rgba(124,92,255,0.4)]"
              >
                Get a Free Estimate
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Magnetic>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:gap-20">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-muted">{col.title}</h4>
                <ul className="mt-4 flex flex-col gap-3">
                  {col.links.map((link) => {
                    const href = getLinkHref(link);
                    const isExternal = href.startsWith("http") || href.startsWith("mailto:");
                    const className = "group inline-flex items-center gap-1.5 text-sm text-foreground/80 transition-colors hover:text-cyan";

                    if (isExternal) {
                      return (
                        <li key={link}>
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-cursor-hover
                            className={className}
                          >
                            {link}
                            <ArrowRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                          </a>
                        </li>
                      );
                    }

                    return (
                      <li key={link}>
                        <Link
                          to={href}
                          data-cursor-hover
                          className={className}
                        >
                          {link}
                          <ArrowRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/8 py-8 text-xs text-muted sm:flex-row">
          <span>© {new Date().getFullYear()} DNT Web. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link to="/" data-cursor-hover className="transition-colors hover:text-foreground">Privacy Policy</Link>
            <Link to="/" data-cursor-hover className="transition-colors hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
