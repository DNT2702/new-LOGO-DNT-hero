import { useEffect, useRef } from "react";

interface ParticleFieldProps {
  density?: number;
  className?: string;
  color?: string;
  interactive?: boolean;
}

export function ParticleField({ density = 70, className, color = "124,92,255", interactive = true }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    // Reduce density limits on mobile screens
    const maxDensity = width < 768 ? 25 : density;
    const count = Math.min(maxDensity, Math.floor((width * height) / 12000));
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      o: Math.random() * 0.5 + 0.15,
    }));

    const connectDist = 110;
    const connectDistSq = connectDist * connectDist;
    const repelRadius = 140;
    const repelRadiusSq = repelRadius * repelRadius;
    const mouse = { x: -9999, y: -9999, active: false };

    let raf: number;
    let inView = false;

    const render = () => {
      if (!inView) return;
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < repelRadiusSq && distSq > 0.0001) {
            const dist = Math.sqrt(distSq);
            const force = ((repelRadius - dist) / repelRadius) * 0.06;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      }

      // Group connections into 3 opacity bins to batch stroke calls (massive GPU call reduction)
      const connectBins: [number, number, number, number][][] = [[], [], []];

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < connectDistSq) {
            const pct = distSq / connectDistSq;
            if (pct < 0.25) {
              connectBins[0].push([a.x, a.y, b.x, b.y]);
            } else if (pct < 0.6) {
              connectBins[1].push([a.x, a.y, b.x, b.y]);
            } else {
              connectBins[2].push([a.x, a.y, b.x, b.y]);
            }
          }
        }
      }

      const alphas = [0.11, 0.06, 0.02];
      for (let k = 0; k < 3; k++) {
        const lines = connectBins[k];
        if (lines.length === 0) continue;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${color},${alphas[k]})`;
        ctx.lineWidth = 1;
        for (let idx = 0; idx < lines.length; idx++) {
          const l = lines[idx];
          ctx.moveTo(l[0], l[1]);
          ctx.lineTo(l[2], l[3]);
        }
        ctx.stroke();
      }

      // Energy trails from particles to cursor in batched bins
      if (mouse.active) {
        const mouseBins: [number, number, number, number][][] = [[], [], []];
        for (const p of particles) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < repelRadiusSq) {
            const pct = distSq / repelRadiusSq;
            if (pct < 0.25) {
              mouseBins[0].push([p.x, p.y, mouse.x, mouse.y]);
            } else if (pct < 0.6) {
              mouseBins[1].push([p.x, p.y, mouse.x, mouse.y]);
            } else {
              mouseBins[2].push([p.x, p.y, mouse.x, mouse.y]);
            }
          }
        }
        const mouseAlphas = [0.28, 0.15, 0.05];
        for (let k = 0; k < 3; k++) {
          const lines = mouseBins[k];
          if (lines.length === 0) continue;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(76,224,255,${mouseAlphas[k]})`;
          ctx.lineWidth = 1;
          for (let idx = 0; idx < lines.length; idx++) {
            const l = lines[idx];
            ctx.moveTo(l[0], l[1]);
            ctx.lineTo(l[2], l[3]);
          }
          ctx.stroke();
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${p.o})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(render);
    };

    // Use IntersectionObserver to pause loop when canvas is off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!inView) {
            inView = true;
            raf = requestAnimationFrame(render);
          }
        } else {
          inView = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(canvas);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    let onMove: ((e: MouseEvent) => void) | undefined;
    let onLeave: (() => void) | undefined;
    if (interactive) {
      onMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = mouse.x >= 0 && mouse.x <= width && mouse.y >= 0 && mouse.y <= height;
      };
      onLeave = () => {
        mouse.active = false;
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseleave", onLeave);
    }

    return () => {
      inView = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      if (onMove) window.removeEventListener("mousemove", onMove);
      if (onLeave) window.removeEventListener("mouseleave", onLeave);
    };
  }, [density, color, interactive]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
