import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Mail, Clock } from "lucide-react";
import {
  getProjects,
  getServices,
  getPageContent,
} from "@/lib/g3-data";
import { SITE_NAME, SITE_DESCRIPTION, EMAIL, pageMetadata } from "@/lib/site";
import Hero from "@/components/g3/Hero";
import StickyLogo from "@/components/g3/StickyLogo";
import ProjectCard from "@/components/g3/ProjectCard";
import ScrollButton from "@/components/g3/ScrollButton";

import dynamic from 'next/dynamic';

const MasterSequence = dynamic(() => import("@/components/g3/MasterSequence"));
const InquiryForm = dynamic(() => import("@/components/g3/InquiryForm"));
import { Reveal, RevealImage } from "@/components/g3/Reveal";
import { revealDelay } from "@/components/g3/motion";
import MaskText from "@/components/MaskText";
import ScrollDrivenSlideIn from "@/components/g3/ScrollDrivenSlideIn";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { G3SocialsDropdown } from "@/components/g3/G3SocialsDropdown";

const PHILOSOPHY = [
  {
    title: "Buildable drawings",
    body: "A drawing that cannot be built on a real site with real labour is decoration. Ours are detailed to the point a contractor stops calling with questions.",
  },
  {
    title: "Budget first, always",
    body: "We design to your number from week one. Nobody should fall in love with a house they cannot afford and then watch it get value-engineered into something else.",
  },
  {
    title: "Materials that age well",
    body: "Coastal Karnataka is hard on buildings - salt, monsoon, sun. We specify for how something looks in year ten, not on handover day.",
  },
];

const FALLBACK_SERVICES = [
  {
    id: -1,
    title: "Interior Design & Execution",
    slug: "interior-design-execution",
    summary: "End-to-end interiors, resolved to the last switch plate and built by our dedicated team.",
    body: "Comprehensive interior planning, joinery detailing, and material selection, fully executed and delivered by our own dedicated craftsmen.",
    iconUrl: null,
    iconAlt: null,
  },
  {
    id: -2,
    title: "Exterior Design Consultancy",
    slug: "exterior-design-consultancy",
    summary: "Architectural and exterior planning and design consultancy.",
    body: "Site study, massing, and the full architectural drawing set - providing expert design and planning while you handle the construction.",
    iconUrl: null,
    iconAlt: null,
  }
];

// The home page is the canonical "/" for every query-string variant (such as
// the old ?category= filter), so those never compete with it in search.
export const metadata: Metadata = pageMetadata({
  title: SITE_NAME,
  absoluteTitle: true,
  description: SITE_DESCRIPTION,
  path: "/",
});

function relatedCategory(title: string): string | null {
  const t = title.toLowerCase();
  if (t.includes("interior")) return "Interiors";
  if (t.includes("architect")) return "Residential";
  if (t.includes("construction")) return "Commercial";
  return null;
}

// No searchParams here, so the page is prerendered and served from the CDN.
// The ?category= filter still works: MasterSequence applies it in the browser.
export default async function G3Home() {
  const [
    allProjects,
    homePage,
    aboutPage,
    fromDbServices
  ] = await Promise.all([
    getProjects(),
    getPageContent("home"),
    getPageContent("about"),
    getServices()
  ]);

  const services = fromDbServices.length ? fromDbServices : FALLBACK_SERVICES;

  const headline = homePage.content.heroHeadline || "Interior Execution. Exterior Consultancy.";
  const tagline =
    homePage.content.heroTagline ||
    "Expert exterior design planning, and end-to-end interior design and making delivered by our dedicated team.";

  const story =
    aboutPage.content.story ||
    "G3 Builders & Architects works across coastal Karnataka on homes, commercial buildings and interiors. We are deliberately small: the people you meet at the first conversation are the same people on site when the concrete is poured.";

  return (
    <>
      <Hero heroImage={homePage.heroImage} headline={headline} tagline={tagline} />

      <div className="fixed top-0 right-0 p-6 md:p-8 z-[42] pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2">
          <G3SocialsDropdown className="flex p-2 shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-[var(--g3-ink)]" />
          <div className="bg-black/5 dark:bg-white/5 backdrop-blur-md rounded-full border border-black/10 dark:border-white/10 text-[var(--g3-ink)]">
            <AnimatedThemeToggler />
          </div>
        </div>
      </div>

      <div className="relative z-10 bg-background">
        <StickyLogo />
        
        <section id="services" className="relative w-full border-t border-[var(--g3-rule-faint)] !z-10 bg-[var(--g3-black)] g3-wood-surface">
          <div className="pb-24 pt-32 md:pt-40">
            <div className="mx-auto max-w-6xl px-6 flex flex-col items-center text-center">
            <h2 className="mb-8 text-4xl md:text-6xl font-black tracking-tight uppercase text-[var(--g3-ink)]">
              <MaskText text="What we do?" />
            </h2>
            <div className="g3-display-lg max-w-4xl flex flex-col items-center text-center w-full" style={{ color: "var(--g3-ink)" }}>
              <div className="text-center w-full"><MaskText text="Two specialized services." className="justify-center" /></div>
              <div className="text-center w-full"><MaskText text="Focused expertise." className="justify-center" /></div>
            </div>
            <div className="flex justify-center">
              <p className="g3-body mt-6 max-w-2xl text-[var(--g3-ink)] text-center">
                We focus on what we do best. We provide expert consultancy and planning for your exterior architecture, while fully executing your interior design with our dedicated in-house team.
              </p>
            </div>
          </div>

          <div className="mx-auto mt-20 max-w-6xl px-6">
            {services.map((s, i) => {
              let related = [];
              const titleLower = s.title.toLowerCase();
              if (titleLower.includes("exterior") || titleLower.includes("external")) {
                const targetSlugs = ["residence-mantradi", "residence-madanthyar", "residence-byndoor"];
                related = allProjects.filter((p) => targetSlugs.includes(p.slug));
                related.sort((a, b) => targetSlugs.indexOf(a.slug) - targetSlugs.indexOf(b.slug));
              } else {
                const cat = relatedCategory(s.title);
                related = cat ? allProjects.filter((p) => p.category === cat).slice(0, 3) : [];
              }

              return (
                <section
                  key={s.id}
                  className="border-t py-16 md:py-20"
                  style={{ borderColor: "var(--g3-rule-faint)" }}
                >
                  <div className="grid gap-8 md:grid-cols-[1fr_1.4fr] md:gap-16">
                    <ScrollDrivenSlideIn startOffset="-5vw">
                      <div className="g3-meta">
                        <MaskText text={String(i + 1).padStart(2, "0")} />
                      </div>
                      <h3 className="g3-display-lg mt-3" style={{ color: "var(--g3-ink)" }}>
                        <MaskText text={s.title} />
                      </h3>
                    </ScrollDrivenSlideIn>

                    <ScrollDrivenSlideIn startOffset="-5vw">
                      {s.summary && (
                        <p className="mb-4 text-xl" style={{ color: "var(--g3-ink)" }}>{s.summary}</p>
                      )}
                      {s.body && <p className="g3-body">{s.body}</p>}

                      <ScrollButton targetId="contact" className="g3-link mt-6">
                        Discuss a {s.title.toLowerCase()} project <ChevronRight aria-hidden="true" />
                      </ScrollButton>
                    </ScrollDrivenSlideIn>
                  </div>

                  {related.length > 0 && (
                    <div className="mt-12">
                      <p className="g3-meta mb-5">Related work</p>
                      <div className="grid gap-5 sm:grid-cols-3">
                        {related.map((p, j) => (
                          <RevealImage key={p.id} delay={revealDelay(j)}>
                            <ProjectCard project={p} headingLevel="h4" />
                          </RevealImage>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </section>

      {/* MASTER SEQUENCE: PORTFOLIO -> IMMERSIVE IMAGE -> HOW IT WORKS */}
      <MasterSequence projects={allProjects}>
        <div className="text-center flex flex-col items-center">
          {/* <span className="g3-meta mb-3 !text-white">Portfolio</span> */}
          <Link href="/projects" className="group">
            <h2 className="g3-display-xl transition-opacity hover:opacity-70 text-white">
              Projects
            </h2>
          </Link>
        </div>
      </MasterSequence>

      {/* MID-PAGE CTA */}
      <section className="bg-[var(--g3-black)] text-[var(--g3-ink)] py-24 md:py-32 flex justify-center border-t border-[var(--g3-rule-faint)] !z-40 relative">
        <div className="text-center max-w-2xl px-6">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-semibold mb-6">Start with a conversation.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-xl mb-10 opacity-80 font-light">
              Tell us what you want and a rough budget. We&rsquo;ll tell you honestly whether what you want fits what you have.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <ScrollButton targetId="contact" className="inline-flex items-center gap-2 rounded-full px-8 py-5 text-lg font-semibold transition-transform hover:scale-105" style={{ background: "var(--g3-ink)", color: "var(--g3-black)" }}>
              Book a consultation <ChevronRight className="h-5 w-5" />
            </ScrollButton>
          </Reveal>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="border-t border-[var(--g3-rule-faint)] !z-40 g3-wood-surface flex flex-col justify-center">
        <div className="py-20 text-center">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="g3-display-xl mx-auto max-w-3xl" style={{ color: "var(--g3-ink)" }}>
                Small enough to care. Equipped to deliver.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="g3-body mt-8 mx-auto max-w-2xl text-center">{story}</p>
            </Reveal>
          </div>



          <section className="mx-auto max-w-6xl px-6 py-24">
            <Reveal>
              <h3 className="g3-display-lg mb-12" style={{ color: "var(--g3-ink)" }}>
                Three things we don&rsquo;t compromise on
              </h3>
            </Reveal>

            <div className="grid gap-10 md:grid-cols-3">
              {PHILOSOPHY.map((p, i) => (
                <Reveal key={p.title} delay={revealDelay(i)}>
                  <h4
                    className="mb-3 text-xl font-semibold tracking-tight"
                    style={{ fontFamily: "var(--g3-font-display)", color: "var(--g3-ink)" }}
                  >
                    {p.title}
                  </h4>
                  <p className="g3-body">{p.body}</p>
                </Reveal>
              ))}
            </div>
          </section>


        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="relative w-full z-40 bg-[var(--g3-black)] border-t border-[var(--g3-rule-faint)]">
        <div className="pb-24 pt-32 md:pt-40">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="g3-display-xl max-w-3xl" style={{ color: "var(--g3-ink)" }}>
                Tell us about your project.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="g3-body mt-6 max-w-xl">
                Three fields to start. We&rsquo;ll call you back within two working days
                - no automated sequence, no mailing list.
              </p>
            </Reveal>

            <div className="mt-16 grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
              <Reveal delay={0.15}>
                <InquiryForm />
              </Reveal>

              <Reveal delay={0.25}>
                <div className="space-y-8">
                  <div>
                    <p className="g3-meta mb-4">Rather talk now?</p>
                    <div className="space-y-3">


                      <a
                        href={`mailto:${EMAIL}`}
                        className="flex items-center gap-3 rounded-lg border px-4 py-3.5 transition-colors"
                        style={{ borderColor: "var(--g3-rule-faint)", color: "var(--g3-ink)" }}
                      >
                        <Mail className="h-4 w-4 shrink-0" style={{ color: "var(--g3-ink)" }} aria-hidden="true" />
                        {EMAIL}
                      </a>
                    </div>
                  </div>

                  <div className="g3-rule" />



                  <div>
                    <p className="g3-meta mb-3">Hours</p>
                    <p className="flex items-start gap-3 g3-body">
                      <Clock className="mt-1 h-4 w-4 shrink-0" style={{ color: "var(--g3-ink)" }} aria-hidden="true" />
                      Monday&ndash;Saturday, 9:30am&ndash;6:30pm<br />
                      Site visits by appointment
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
