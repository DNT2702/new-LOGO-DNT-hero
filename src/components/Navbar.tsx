import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/MagneticButton";

const links = [
  { label: "Services", href: "services" },
  { label: "Why DNT", href: "why-dnt" },
  { label: "Work", href: "portfolio" },
  { label: "Process", href: "process" },
  { label: "Testimonials", href: "testimonials" },
];

function CanvasLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const img = new Image();
    img.src = '/dnt logo.jpg';
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const pixelIndex = i / 4;
        const x = pixelIndex % canvas.width;
        const y = Math.floor(pixelIndex / canvas.width);

        // Erase "DNT WEB" text on the top left
        if (x < canvas.width * 0.35 && y < canvas.height * 0.35) {
          data[i + 3] = 0;
          continue;
        }

        const brightness = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
        
        // Smooth anti-aliasing for sharp crisp edges
        let alpha = 255;
        if (brightness > 220) {
          alpha = 0; // Pure white background becomes fully transparent
        } else if (brightness > 120) {
          // Smoothly fade the edge pixels
          alpha = 255 - ((brightness - 120) / 100) * 255;
        }

        // Turn the dark logo pure white
        data[i] = 255;     // R
        data[i + 1] = 255; // G
        data[i + 2] = 255; // B
        data[i + 3] = alpha; // A
      }
      ctx.putImageData(imageData, 0, 0);
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full object-contain scale-[2.5] origin-right translate-x-3" style={{ objectPosition: 'right center' }} />;
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Only set active based on intersection if we are on the home page
    if (location.pathname !== "/") {
      setActive("");
      return;
    }

    const sections = links
      .map((link) => document.querySelector(`#${link.href}`))
      .filter((el): el is Element => !!el);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [location.pathname]);

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
        <Link to="/" className="flex items-center gap-0 ml-10" data-cursor-hover>
          <div className="relative flex h-12 w-14 items-center justify-center bg-transparent -mr-4">
            <CanvasLogo />
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">Web</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => {
            const isActive = active === link.href;
            return (
              <Link
                key={link.href}
                to={`/#${link.href}`}
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
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Magnetic strength={0.3}>
            <Link
              to="/#contact"
              data-cursor-hover
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-cyan px-5 py-2.5 text-sm font-semibold text-void transition-shadow hover:shadow-[0_0_30px_rgba(124,92,255,0.4)]"
            >
              Get In Touch
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
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
                <Link
                  key={link.href}
                  to={`/#${link.href}`}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-muted transition-colors hover:bg-white/5 hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/#contact"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-xl bg-gradient-to-r from-primary to-cyan px-4 py-3 text-center text-sm font-semibold text-void"
              >
                Get In Touch
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
