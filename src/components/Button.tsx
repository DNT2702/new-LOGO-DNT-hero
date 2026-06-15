import { useState } from "react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Magnetic } from "@/components/MagneticButton";
import { cn } from "@/lib/utils";

interface BaseProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  icon?: ReactNode;
}

const variants: Record<string, string> = {
  primary:
    "bg-gradient-to-r from-primary to-cyan text-void font-semibold shadow-[0_0_30px_rgba(124,92,255,0.35)] hover:shadow-[0_0_50px_rgba(124,92,255,0.5)]",
  secondary: "glass text-foreground hover:bg-white/10",
  ghost: "text-foreground border border-white/15 hover:border-white/30 hover:bg-white/5",
};

const base =
  "group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

function Ripples({ ripples }: { ripples: Ripple[] }) {
  return (
    <AnimatePresence>
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="pointer-events-none absolute rounded-full bg-white/40"
          style={{ left: r.x, top: r.y, translateX: "-50%", translateY: "-50%" }}
          initial={{ width: 0, height: 0, opacity: 0.5 }}
          animate={{ width: 260, height: 260, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </AnimatePresence>
  );
}

function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const addRipple = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 750);
  };

  return { ripples, addRipple };
}

export function Button({
  children,
  variant = "primary",
  className,
  icon,
  onClick,
  ...props
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { ripples, addRipple } = useRipple();

  return (
    <Magnetic strength={0.3}>
      <button
        className={cn(base, variants[variant], className)}
        onClick={(e) => {
          addRipple(e);
          onClick?.(e);
        }}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        {icon && <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">{icon}</span>}
        <Ripples ripples={ripples} />
      </button>
    </Magnetic>
  );
}

import { Link } from "react-router-dom";

export function LinkButton({
  children,
  variant = "primary",
  className,
  icon,
  onClick,
  href = "",
  ...props
}: BaseProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { ripples, addRipple } = useRipple();
  
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");
  if (isExternal) {
    return (
      <Magnetic strength={0.3}>
        <a
          className={cn(base, variants[variant], className)}
          onClick={(e) => {
            addRipple(e);
            onClick?.(e);
          }}
          href={href}
          {...props}
        >
          <span className="relative z-10">{children}</span>
          {icon && <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">{icon}</span>}
          <Ripples ripples={ripples} />
        </a>
      </Magnetic>
    );
  }

  return (
    <Magnetic strength={0.3}>
      <Link
        to={href}
        className={cn(base, variants[variant], className)}
        onClick={(e: any) => {
          addRipple(e);
          onClick?.(e);
        }}
        {...(props as any)}
      >
        <span className="relative z-10">{children}</span>
        {icon && <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">{icon}</span>}
        <Ripples ripples={ripples} />
      </Link>
    </Magnetic>
  );
}
