import type { OrbShape } from "@/components/three/MiniOrb";

export interface Service {
  portfolioSlug?: string;
  shape: OrbShape;
  colorA: string;
  colorB: string;
  title: string;
  description: string;
}

export const services: Service[] = [
  {
    portfolioSlug: "solace-studio",
    shape: "icosahedron",
    colorA: "#7c5cff",
    colorB: "#4ce0ff",
    title: "Website Development",
    description: "Lightning-fast, pixel-perfect websites engineered for conversion, built on modern frameworks.",
  },
  {
    portfolioSlug: "lumora-skincare",
    shape: "box",
    colorA: "#ffc56b",
    colorB: "#7c5cff",
    title: "E-Commerce Development",
    description: "Conversion-focused online stores with seamless checkout, inventory and payment integrations.",
  },
  {
    portfolioSlug: "northpeak-capital",
    shape: "octahedron",
    colorA: "#4ce0ff",
    colorB: "#7c5cff",
    title: "Custom Web Applications",
    description: "Scalable, secure web apps tailored to your workflows — built to grow with your business.",
  },
  {
    portfolioSlug: "verve-fitness",
    shape: "torusKnot",
    colorA: "#7c5cff",
    colorB: "#ffc56b",
    title: "AI Integrations",
    description: "Intelligent chatbots, automation agents and AI-powered features that work around the clock.",
  },
  {
    portfolioSlug: "atlas-logistics",
    shape: "torus",
    colorA: "#4ce0ff",
    colorB: "#ffc56b",
    title: "Business Automation",
    description: "Streamline operations with automated pipelines that eliminate repetitive manual work.",
  },
  {
    shape: "cone",
    colorA: "#7c5cff",
    colorB: "#4ce0ff",
    title: "SEO Optimization",
    description: "Technical SEO and content strategy that gets you found, ranked and chosen.",
  },
  {
    shape: "dodecahedron",
    colorA: "#ffc56b",
    colorB: "#4ce0ff",
    title: "Digital Marketing",
    description: "Data-driven campaigns across search and social that turn attention into revenue.",
  },
  {
    shape: "sphere",
    colorA: "#7c5cff",
    colorB: "#ffc56b",
    title: "UI/UX Design",
    description: "Award-worthy interfaces rooted in research, crafted to feel intuitive and premium.",
  },
];

