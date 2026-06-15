import { Hero } from "@/sections/Hero";
import { Services } from "@/sections/Services";
import { WhyDNT } from "@/sections/WhyDNT";
import { Portfolio } from "@/sections/Portfolio";
import { Process } from "@/sections/Process";
import { Results } from "@/sections/Results";
import { Testimonials } from "@/sections/Testimonials";
import { Contact } from "@/sections/Contact";

export function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <WhyDNT />
      <Portfolio />
      <Process />
      <Results />
      <Testimonials />
      <Contact />
    </main>
  );
}
