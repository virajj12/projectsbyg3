export const runtime = 'edge';

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronRight, Mail, MapPin, Clock } from "lucide-react";
import {
  getProjects,
  getServices,
  getPageContent,
  G3_CATEGORIES
} from "@/lib/g3-data";
import Hero from "@/components/g3/Hero";
import ProjectCard from "@/components/g3/ProjectCard";
import CategoryFilter from "@/components/g3/CategoryFilter";
import dynamic from 'next/dynamic';

const MasterSequence = dynamic(() => import("@/components/g3/MasterSequence"));
const InquiryForm = dynamic(() => import("@/components/g3/InquiryForm"));
import { Reveal, RevealLeft, RevealImage } from "@/components/g3/Reveal";
import { revealDelay } from "@/components/g3/motion";
import { MaskedSection } from "@/components/g3/MaskedSection";
import MaskText from "@/components/MaskText";
import ScrollDrivenSlideIn from "@/components/g3/ScrollDrivenSlideIn";

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
    body: "Coastal Karnataka is hard on buildings — salt, monsoon, sun. We specify for how something looks in year ten, not on handover day.",
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
    body: "Site study, massing, and the full architectural drawing set—providing expert design and planning while you handle the construction.",
    iconUrl: null,
    iconAlt: null,
  }
];

const EMAIL = "hey@verspektive.in";

function relatedCategory(title: string): string | null {
  const t = title.toLowerCase();
  if (t.includes("interior")) return "Interiors";
  if (t.includes("architect")) return "Residential";
  if (t.includes("construction")) return "Commercial";
  return null;
}

export default async function G3Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

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

  const dynamicCategories = Array.from(new Set([...G3_CATEGORIES, ...allProjects.map(p => p.category)]));
  const validCategory = category && dynamicCategories.includes(category) ? category : undefined;
  const filteredProjects = validCategory ? allProjects.filter(p => p.category === validCategory) : allProjects;

  const services = fromDbServices.length ? fromDbServices : FALLBACK_SERVICES;

  const counts: Record<string, number> = {};
  for (const c of dynamicCategories) counts[c] = allProjects.filter((p) => p.category === c).length;

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



      <section id="services" className="relative w-full border-t border-[var(--g3-rule-faint)] !z-10 bg-[var(--g3-black)] g3-wood-surface">
        <div className="pb-24 pt-32 md:pt-40">
          <div className="mx-auto max-w-6xl px-6">
            <div className="g3-meta mb-3 text-[var(--g3-ink)]">
              <MaskText text="What we do" />
            </div>
            <div className="g3-display-lg max-w-4xl" style={{ color: "var(--g3-ink)" }}>
              <div><MaskText text="Two specialized services." /></div>
              <div><MaskText text="Focused expertise." /></div>
            </div>
            <div>
              <p className="g3-body mt-6 max-w-2xl text-[var(--g3-ink)]">
                We focus on what we do best. We provide expert consultancy and planning for your exterior architecture, while fully executing your interior design with our dedicated in-house team.
              </p>
            </div>
          </div>

          <div className="mx-auto mt-20 max-w-6xl px-6">
            {services.map((s, i) => {
              const cat = relatedCategory(s.title);
              const related = cat ? allProjects.filter((p) => p.category === cat).slice(0, 3) : [];

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
                      <div className="g3-display-lg mt-3" style={{ color: "var(--g3-ink)" }}>
                        <MaskText text={s.title} />
                      </div>
                    </ScrollDrivenSlideIn>

                    <ScrollDrivenSlideIn startOffset="-5vw">
                      {s.summary && (
                        <p className="mb-4 text-xl" style={{ color: "var(--g3-ink)" }}>{s.summary}</p>
                      )}
                      {s.body && <p className="g3-body">{s.body}</p>}

                      <Link href="#contact" className="g3-link mt-6">
                        Discuss a {s.title.toLowerCase()} project <ChevronRight aria-hidden="true" />
                      </Link>
                    </ScrollDrivenSlideIn>
                  </div>

                  {related.length > 0 && (
                    <div className="mt-12">
                      <p className="g3-meta mb-5">Related work</p>
                      <div className="grid gap-5 sm:grid-cols-3">
                        {related.map((p, j) => (
                          <RevealImage key={p.id} delay={revealDelay(j)}>
                            <ProjectCard project={p} />
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
      <MasterSequence projects={filteredProjects}>
        <div className="text-center flex flex-col items-center">
          {/* <span className="g3-meta mb-3 !text-white">Portfolio</span> */}
          <Link href="/projects" className="group">
            <h1 className="g3-display-xl transition-opacity hover:opacity-70 text-white">
              Projects <sup className="text-lg opacity-50 relative -top-8 group-hover:opacity-100 transition-opacity">( {allProjects.length} )</sup>
            </h1>
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
              Bring your site documents and a rough budget. We&rsquo;ll tell you honestly whether what you want fits what you have.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Link href="#contact" className="inline-flex items-center gap-2 rounded-full px-8 py-5 text-lg font-semibold transition-transform hover:scale-105" style={{ background: "var(--g3-ink)", color: "var(--g3-black)" }}>
              Book a consultation <ChevronRight className="h-5 w-5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="border-t border-[var(--g3-rule-faint)] !z-40 g3-wood-surface flex flex-col justify-center">
        <div className="py-20 text-center">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <span className="g3-meta">About</span>
              <h1 className="g3-display-xl mt-3 mx-auto max-w-3xl" style={{ color: "var(--g3-ink)" }}>
                Small enough to care. Equipped to deliver.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="g3-body mt-8 mx-auto max-w-2xl text-center">{story}</p>
            </Reveal>
          </div>



          <section className="mx-auto max-w-6xl px-6 py-24">
            <Reveal>
              <span className="g3-meta">How we think</span>
              <h2 className="g3-display-lg mb-12 mt-3" style={{ color: "var(--g3-ink)" }}>
                Three things we don&rsquo;t compromise on
              </h2>
            </Reveal>

            <div className="grid gap-10 md:grid-cols-3">
              {PHILOSOPHY.map((p, i) => (
                <Reveal key={p.title} delay={revealDelay(i)}>
                  <h3
                    className="mb-3 text-xl font-semibold tracking-tight"
                    style={{ fontFamily: "var(--g3-font-display)", color: "var(--g3-ink)" }}
                  >
                    {p.title}
                  </h3>
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
              <span className="g3-meta">Get in touch</span>
              <h1 className="g3-display-xl mt-3 max-w-3xl" style={{ color: "var(--g3-ink)" }}>
                Tell us about your project.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="g3-body mt-6 max-w-xl">
                Three fields to start. We&rsquo;ll call you back within two working days
                — no automated sequence, no mailing list.
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
                    <p className="g3-meta mb-3">Office</p>
                    <p className="flex items-start gap-3 g3-body">
                      <MapPin className="mt-1 h-4 w-4 shrink-0" style={{ color: "var(--g3-ink)" }} aria-hidden="true" />
                      Moodbidri, Dakshina Kannada<br />Karnataka, India
                    </p>
                  </div>

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
    </>
  );
}
