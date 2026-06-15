import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Home } from "@/pages/Home";
import { ProjectDetails } from "@/pages/ProjectDetails";

const UniverseCanvas = lazy(() => import("@/components/three/UniverseCanvas").then((m) => ({ default: m.UniverseCanvas })));

import { useLenis } from "lenis/react";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        if (lenis) {
          try {
            const targetEl = document.querySelector(hash) as HTMLElement | null;
            if (targetEl) {
              lenis.scrollTo(targetEl, { duration: 1.2 });
            }
          } catch (e) {
            console.error("Lenis scroll error", e);
          }
        } else {
          const el = document.getElementById(hash.substring(1));
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [pathname, hash, lenis]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <ScrollToTop />
        <Suspense fallback={null}>
          <UniverseCanvas />
        </Suspense>
        <Cursor />
        <div className="noise" />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<ProjectDetails />} />
        </Routes>
        <Footer />
      </SmoothScroll>
    </BrowserRouter>
  );
}

export default App;
