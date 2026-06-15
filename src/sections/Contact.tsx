import { useState } from "react";
import type { FormEvent } from "react";
import { motion } from "motion/react";
import { Mail, MessageCircle, CalendarClock, ArrowRight, CheckCircle2 } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { Button, LinkButton } from "@/components/Button";
import { GlowOrbs } from "@/components/GlowOrbs";
import { Parallax } from "@/components/Parallax";
import { Magnetic } from "@/components/MagneticButton";

const projectTypes = ["Website", "E-Commerce", "Web Application", "Automation / AI", "SEO", "Other"];
const budgets = ["6,000 Rupees (Starter Pack)", "8,000 to 10,000 Rupees (Growth Pack)", "15,000+ Rupees (Premium Pack)"];

const countryCodes = [
  { code: "+91", flag: "🇮🇳" },
  { code: "+1", flag: "🇺🇸" },
  { code: "+44", flag: "🇬🇧" },
  { code: "+971", flag: "🇦🇪" },
  { code: "+61", flag: "🇦🇺" },
  { code: "+65", flag: "🇸🇬" },
];

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 10) {
      setPhone(val);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative overflow-hidden py-28 sm:py-36">
      <Parallax speed={50} className="absolute inset-0">
        <GlowOrbs />
      </Parallax>

      <div className="container-px relative z-10 mx-auto">
        <SectionHeader
          eyebrow="Let's Build Something Great"
          title="Start Your Project Today"
          description="Tell us about your business and goals — we'll get back to you within 24 hours with next steps."
          align="center"
          className="mx-auto"
        />

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4 lg:col-span-2"
          >
            <a
              href="mailto:dntweb2702@gmail.com"
              data-cursor-hover
              className="glass group flex items-center gap-4 rounded-2xl p-5 transition-colors hover:border-white/20"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-cyan/20 ring-1 ring-white/10">
                <Mail className="h-5 w-5 text-primary-2" />
              </span>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted">Email Us</div>
                <div className="font-medium text-foreground">dntweb2702@gmail.com</div>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-muted transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href="https://wa.me/10000000000"
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              className="glass group flex items-center gap-4 rounded-2xl p-5 transition-colors hover:border-white/20"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan/20 to-gold/20 ring-1 ring-white/10">
                <MessageCircle className="h-5 w-5 text-cyan" />
              </span>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted">WhatsApp</div>
                <div className="font-medium text-foreground">Chat with our team</div>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-muted transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href="#contact"
              data-cursor-hover
              className="glass group flex items-center gap-4 rounded-2xl p-5 transition-colors hover:border-white/20"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold/20 to-primary/20 ring-1 ring-white/10">
                <CalendarClock className="h-5 w-5 text-gold" />
              </span>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted">Schedule</div>
                <div className="font-medium text-foreground">Book a free strategy call</div>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-muted transition-transform group-hover:translate-x-1" />
            </a>

            <div className="glass mt-2 flex-1 rounded-2xl p-6">
              <p className="text-sm leading-relaxed text-muted">
                Whether you need a stunning new website, a custom application, or an AI-powered
                automation system — our team is ready to bring it to life with the same care and
                craft you'd expect from a top-tier agency. We focus on creating high-performance digital products that drive measurable business outcomes, increase engagement, and scale seamlessly as your business grows. Let's build your next digital solution together.
              </p>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="glass-strong rounded-3xl p-6 sm:p-10 lg:col-span-3"
          >
            {submitted ? (
              <div className="flex h-full min-h-[24rem] flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-14 w-14 text-cyan" />
                <h3 className="mt-6 font-display text-2xl font-semibold">Message Sent</h3>
                <p className="mt-2 max-w-sm text-muted">
                  Thanks for reaching out — a member of our team will get back to you within 24 hours.
                </p>
                <Button className="mt-8" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Full Name" name="name" placeholder="Jane Doe" required />
                <Field label="Email Address" name="email" type="email" placeholder="jane@company.com" required />
                
                {/* Phone Number with Country Code Dropdown */}
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-widest text-muted" htmlFor="phone">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/50 cursor-pointer"
                    >
                      {countryCodes.map((c) => (
                        <option key={c.code} value={c.code} className="bg-void text-foreground">
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      required
                      placeholder="98765 43210"
                      className="w-full flex-1 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none transition-colors focus:border-primary/50"
                    />
                  </div>
                </div>

                <Field label="Company" name="company" placeholder="Acme Inc." />

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs uppercase tracking-widest text-muted">Project Type</label>
                  <div className="flex flex-wrap gap-2">
                    {projectTypes.map((type) => (
                      <PillOption key={type} name="projectType" label={type} />
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs uppercase tracking-widest text-muted">Budget Range</label>
                  <div className="flex flex-wrap gap-2">
                    {budgets.map((b) => (
                      <PillOption key={b} name="budget" label={b} />
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs uppercase tracking-widest text-muted">Project Details</label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    placeholder="Tell us about your project, goals and timeline..."
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none transition-colors focus:border-primary/50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Magnetic strength={0.2} className="block w-full">
                    <button
                      type="submit"
                      data-cursor-hover
                      className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-cyan px-7 py-4 text-sm font-semibold text-void shadow-[0_0_30px_rgba(124,92,255,0.35)] transition-shadow hover:shadow-[0_0_50px_rgba(124,92,255,0.5)]"
                    >
                      Send Message
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Magnetic>
                </div>
              </form>
            )}
          </motion.div>
        </div>

        <div className="mt-10 flex justify-center">
          <LinkButton href="#home" variant="ghost">
            Back to Top
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-xs uppercase tracking-widest text-muted" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none transition-colors focus:border-primary/50"
      />
    </div>
  );
}

function PillOption({ name, label }: { name: string; label: string }) {
  return (
    <label className="cursor-pointer">
      <input type="radio" name={name} value={label} className="peer hidden" />
      <span
        data-cursor-hover
        className="inline-flex rounded-full border border-white/10 px-4 py-2 text-xs text-muted transition-all peer-checked:border-primary/50 peer-checked:bg-gradient-to-r peer-checked:from-primary/20 peer-checked:to-cyan/20 peer-checked:text-foreground hover:border-white/25"
      >
        {label}
      </span>
    </label>
  );
}
