export interface PortfolioItem {
  title: string;
  slug: string;
  category: string;
  description: string;
  tags: string[];
  gradient: string;
  challenge: string;
  solution: string;
  results: string[];
}

export const portfolioItems: PortfolioItem[] = [
  {
    title: "Lumora Skincare",
    slug: "lumora-skincare",
    category: "E-Commerce Development",
    description: "A premium D2C skincare storefront with custom product configurator and a 68% lift in conversion rate.",
    tags: ["Shopify", "Headless", "Conversion"],
    gradient: "linear-gradient(135deg, #ff9a8b 0%, #7c5cff 60%, #4ce0ff 100%)",
    challenge: "Lumora's legacy storefront suffered from slow load times, high bounce rates, and a rigid template that restricted their branding. They needed a custom solution that felt as premium as their products while handling complex product bundles.",
    solution: "We engineered a headless Shopify storefront using Next.js and Sanity CMS. We built a visually stunning interactive 3D product configurator, optimized the checkout flow, and introduced micro-animations to enhance the luxury feel.",
    results: [
      "68% increase in conversion rate",
      "3.5x faster page load speeds",
      "42% decrease in cart abandonment"
    ]
  },
  {
    title: "Northpeak Capital",
    slug: "northpeak-capital",
    category: "Web Application",
    description: "A real-time investor dashboard with secure data pipelines, custom charting and role-based access.",
    tags: ["Dashboard", "Fintech", "Realtime"],
    gradient: "linear-gradient(135deg, #4ce0ff 0%, #7c5cff 50%, #1c1c2e 100%)",
    challenge: "Northpeak was managing hundreds of millions in assets using decentralized spreadsheets, leading to reporting delays and a fragmented investor experience.",
    solution: "We designed and developed a secure, real-time portal for investors to track their portfolios. The application featured role-based access control, complex data visualization, and automated data pipelines hooked directly into their financial backend.",
    results: [
      "Zero reporting delays",
      "Fully automated data pipelines",
      "100% adoption rate among investors"
    ]
  },
  {
    title: "Atlas Logistics",
    slug: "atlas-logistics",
    category: "Business Automation",
    description: "Automated dispatch and reporting system that cut manual ops work by 40 hours per week.",
    tags: ["Automation", "Internal Tools", "API"],
    gradient: "linear-gradient(135deg, #ffc56b 0%, #ff7c7c 50%, #7c5cff 100%)",
    challenge: "Atlas struggled with a manual dispatching process that relied heavily on phone calls and whiteboards, creating immense operational bottlenecks as the fleet scaled.",
    solution: "We built a custom internal tooling system that integrated directly with their GPS tracking API. The platform automates route assignment, provides real-time tracking, and handles automated daily reporting.",
    results: [
      "40 hours/week saved in manual operations",
      "22% reduction in fleet idle time",
      "Seamless integration with legacy ERP"
    ]
  },
  {
    title: "Verve Fitness",
    slug: "verve-fitness",
    category: "AI Integration",
    description: "An AI coaching assistant embedded across web and mobile, driving 3x engagement on member plans.",
    tags: ["AI Agent", "Mobile-first", "Personalization"],
    gradient: "linear-gradient(135deg, #a78bfa 0%, #4ce0ff 50%, #050507 100%)",
    challenge: "Members were abandoning their fitness plans due to a lack of personalized guidance outside of the gym. Verve needed a scalable way to provide customized support.",
    solution: "We integrated a fine-tuned LLM into their existing app ecosystem to act as a 24/7 personal coach. The AI agent analyzes user workout data, suggests plan adjustments, and answers health queries in real-time.",
    results: [
      "3x increase in member engagement",
      "45% higher plan completion rate",
      "Highly scalable personalized coaching"
    ]
  },
  {
    title: "Solace Studio",
    slug: "solace-studio",
    category: "Website Development",
    description: "An award-winning portfolio site for a design studio, featuring cinematic scroll storytelling.",
    tags: ["Awwwards", "Branding", "Animation"],
    gradient: "linear-gradient(135deg, #7c5cff 0%, #ffc56b 60%, #4ce0ff 100%)",
    challenge: "Solace Studio, a top-tier creative agency, needed a website that reflected their ultra-premium design standards. Off-the-shelf solutions were simply too restrictive.",
    solution: "We crafted a highly custom, interactive WebGL experience with cinematic scroll animations. The site acts as a blank canvas that dynamically morphs and reacts to the user's journey through the portfolio.",
    results: [
      "Awwwards Site of the Day",
      "FWA of the Day",
      "120% increase in high-ticket inbound leads"
    ]
  },
];
