/**
 * Project detail (spec 4.3): full-bleed hero, metadata block, narrative,
 * gallery, prev/next navigation.
 *
 * Emits per-project structured data and an Open Graph image (spec 7) so a
 * shared project link previews with its own cover rather than a generic card.
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProjectBySlug, getProjects } from "@/lib/g3-data";
import {
  SITE_NAME,
  ORGANIZATION_ID,
  WEBSITE_ID,
  absoluteUrl,
  breadcrumbList,
  jsonLd,
  pageMetadata,
  projectPlace,
} from "@/lib/site";
import type { G3Project } from "@/lib/g3-constants";

// Every project page is prerendered at build time and served from the CDN.
// A slug that is not in the content is a real 404, not a rendered page.
export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

/** "Vintage Library" from "Vintage Library | Bajagoli". */
function projectName(title: string): string {
  return title.split("|")[0].trim() || title;
}

/**
 * Unique per project and built only from its own content: the summary, then
 * what kind of project it is and where, from the category and the place in
 * the title.
 */
function projectDescription(project: G3Project): string {
  const place = projectPlace(project.title);
  const kind = `${project.category === "Concept" ? "Concept" : project.category} project${place ? ` in ${place}` : ""} by ${SITE_NAME}.`;
  return project.summary ? `${project.summary} ${kind}` : kind;
}
import { Reveal, RevealImage } from "@/components/g3/Reveal";
import { revealDelay } from "@/components/g3/motion";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProjectBySlug(slug);
  if (!data) return { title: "Project not found", robots: { index: false } };

  const { project } = data;
  return pageMetadata({
    title: project.title,
    description: projectDescription(project),
    path: `/projects/${project.slug}`,
    images: project.cover ? [{ url: project.cover.url, alt: project.cover.alt || project.title }] : undefined,
  });
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getProjectBySlug(slug);
  if (!data) notFound();

  const { project, gallery, prev, next } = data;

  const allGalleryImages = project.cover ? [project.cover, ...gallery] : gallery;

  // The place comes from the title ("Residence | Mantradi"); the content's
  // `location` field holds placeholders like "Confidential", so it is not
  // published as a place. Image URLs are absolute, as structured data needs.
  const url = absoluteUrl(`/projects/${project.slug}`);
  const place = projectPlace(project.title);
  const images = allGalleryImages.filter((g) => g.type !== "video").map((g) => absoluteUrl(g.url));
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#project`,
        url,
        name: project.title,
        alternateName: projectName(project.title) !== project.title ? projectName(project.title) : undefined,
        description: project.summary || undefined,
        genre: project.category,
        image: images.length ? images : undefined,
        dateCreated: project.year ? String(project.year) : undefined,
        creator: { "@id": ORGANIZATION_ID },
        locationCreated: place ? { "@type": "Place", name: place } : undefined,
        isPartOf: { "@id": WEBSITE_ID },
      },
      breadcrumbList([
        { name: "Home", path: "/" },
        { name: "Projects", path: "/projects" },
        { name: project.title, path: `/projects/${project.slug}` },
      ]),
    ],
  };

  return (
    <article className="relative bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />

      <div className="absolute top-0 left-0 right-0 p-6 md:p-8 flex justify-between items-center z-50 pointer-events-none">
        <Link 
          href="/projects" 
          className="pointer-events-auto bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full p-2 text-white transition-all flex items-center justify-center"
          aria-label="Back to Projects"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" aria-hidden="true" />
        </Link>
      </div>

      {/* Hero */}
      <section className="relative flex min-h-[70svh] items-end overflow-hidden">
        <div className="absolute inset-0">
          {project.cover ? (
            <Image
              src={project.cover.url}
              alt={project.cover.alt || project.title}
              fill
              preload
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="g3-wood-surface absolute inset-0" />
          )}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(10,9,8,0.95) 10%, rgba(10,9,8,0.3) 60%, rgba(10,9,8,0.6) 100%)" }}
          />
        </div>

        <div className="relative mx-auto w-full max-w-5xl px-6 pb-16 pt-32">
          {/* Above the fold: CSS entrance, so the heading paints before JS. */}
          <h1 className="g3-enter g3-display-lg mt-3" style={{ color: "var(--g3-ink)" }}>{project.title}</h1>
        </div>
      </section>



      {/* Narrative */}
      {project.summary && (
        <section className="mx-auto max-w-3xl px-6 py-20 md:py-28">
          <Reveal>
            <p className="g3-display-md" style={{ color: "var(--g3-ink)" }}>{project.summary}</p>
          </Reveal>
        </section>
      )}

      {/* Gallery */}
      {allGalleryImages.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-5 sm:grid-cols-2">
            {allGalleryImages.map((g, i) => (
              <RevealImage
                key={`${g.url}-${i}`}
                delay={revealDelay(i, 0.06)}
                /* Every third image runs full width so the gallery has rhythm
                   rather than reading as an even, monotonous grid. */
                className={i % 3 === 0 ? "sm:col-span-2" : ""}
              >
                <figure>
                  <div
                    className="relative overflow-hidden rounded-xl"
                    style={{ aspectRatio: i % 3 === 0 ? "16 / 9" : "4 / 3", background: "var(--g3-black-raised)" }}
                  >
                    {g.type === "video" ? (
                      /* preload="none" + poster keeps gallery video off the
                         mobile page weight until it is actually played. */
                      <video
                        src={g.url}
                        poster={g.thumbnailUrl || undefined}
                        controls
                        preload="none"
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image
                        src={g.url}
                        alt={g.alt}
                        fill
                        loading="lazy"
                        sizes={i % 3 === 0 ? "(max-width: 640px) 100vw, 1152px" : "(max-width: 640px) 100vw, 576px"}
                        className="object-cover"
                      />
                    )}
                  </div>
                  
                </figure>
              </RevealImage>
            ))}
          </div>
        </section>
      )}

      {/* Prev / next */}
      <nav aria-label="More projects" className="border-t" style={{ borderColor: "var(--g3-rule-faint)" }}>
        <div className="mx-auto flex max-w-5xl items-stretch justify-between gap-4 px-6 py-10">
          {prev ? (
            <Link href={`/projects/${prev.slug}`} className="flex-1">
              <span className="g3-meta flex items-center gap-1">
                <ChevronLeft className="h-3 w-3" aria-hidden="true" /> Previous
              </span>
              <p className="mt-1.5 font-medium" style={{ color: "var(--g3-ink)" }}>{prev.title}</p>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {next ? (
            <Link href={`/projects/${next.slug}`} className="flex-1 text-right">
              <span className="g3-meta flex items-center justify-end gap-1">
                Next <ChevronRight className="h-3 w-3" aria-hidden="true" />
              </span>
              <p className="mt-1.5 font-medium" style={{ color: "var(--g3-ink)" }}>{next.title}</p>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </nav>
    </article>
  );
}
