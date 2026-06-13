import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/MagneticButton";

const links = [
  { label: "Services", href: "#services" },
  { label: "Why DNT", href: "#why-dnt" },
  { label: "Work", href: "#portfolio" },
  { label: "Process", href: "#process" },
  { label: "Testimonials", href: "#testimonials" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = links
      .map((link) => document.querySelector(link.href))
      .filter((el): el is Element => !!el);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "container-px mx-auto mt-4 flex items-center justify-between rounded-full px-5 py-3 transition-all duration-500",
          scrolled ? "glass-strong shadow-[0_8px_32px_rgba(0,0,0,0.4)]" : "bg-transparent"
        )}
      >
        <a href="#home" className="flex items-center gap-2" data-cursor-hover>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan font-display text-base font-bold text-void shadow-[0_0_16px_rgba(124,92,255,0.5)]">
            D
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">DNT Web</span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => {
            const isActive = active === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                data-cursor-hover
                className={cn(
                  "relative text-sm font-medium transition-colors",
                  isActive ? "text-foreground" : "text-muted hover:text-foreground"
                )}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute -bottom-1.5 left-0 right-0 h-px bg-gradient-to-r from-primary to-cyan"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Magnetic strength={0.3}>
            <a
              href="#contact"
              data-cursor-hover
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-cyan px-5 py-2.5 text-sm font-semibold text-void transition-shadow hover:shadow-[0_0_30px_rgba(124,92,255,0.4)]"
            >
              Get In Touch
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Magnetic>
        </div>

        <button
          onClick={() => setOpen(!open)}
          data-cursor-hover
          className="flex h-10 w-10 items-center justify-center rounded-full glass lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="container-px mx-auto mt-2 lg:hidden"
          >
            <div className="glass-strong flex flex-col gap-1 rounded-3xl p-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-muted transition-colors hover:bg-white/5 hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-xl bg-gradient-to-r from-primary to-cyan px-4 py-3 text-center text-sm font-semibold text-void"
              >
                Get In Touch
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
