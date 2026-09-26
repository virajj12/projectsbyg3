import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { getProjects } from "@/lib/g3-data";
import { Reveal } from "@/components/g3/Reveal";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { G3SocialsDropdown } from "@/components/g3/G3SocialsDropdown";
import dynamic from 'next/dynamic';
import { SITE_NAME, WEBSITE_ID, absoluteUrl, breadcrumbList, jsonLd, pageMetadata } from "@/lib/site";

const MouseScaleGallery = dynamic(() => import("@/components/g3/MouseScaleGallery"));

const DESCRIPTION =
  "Selected work by G3 Builders & Architects across coastal Karnataka, ranging from residential builds to commercial spaces and interior execution.";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description: DESCRIPTION,
  path: "/projects",
});

export default async function ProjectsPage() {
  const allProjects = await getProjects();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${absoluteUrl("/projects")}#page`,
        url: absoluteUrl("/projects"),
        name: `Projects · ${SITE_NAME}`,
        description: DESCRIPTION,
        isPartOf: { "@id": WEBSITE_ID },
        hasPart: allProjects.map((p) => ({
          "@type": "CreativeWork",
          name: p.title,
          url: absoluteUrl(`/projects/${p.slug}`),
        })),
      },
      breadcrumbList([
        { name: "Home", path: "/" },
        { name: "Projects", path: "/projects" },
      ]),
    ],
  };

  // Extract all images from all projects
  const allImages = allProjects.flatMap(project => {
    const images = [];
    if (project.cover) {
      images.push({ ...project.cover, projectTitle: project.title, projectSlug: project.slug, isCover: true });
    }
    if (project.gallery) {
      project.gallery.forEach((img: any) => {
        images.push({ ...img, projectTitle: project.title, projectSlug: project.slug });
      });
    }
    return images;
  });

  return (
    <div className="bg-background min-h-screen pt-32 pb-24 transition-colors duration-300 relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
      <div className="fixed top-0 left-0 right-0 p-6 md:p-8 flex justify-between items-center z-50 pointer-events-none">
        <Link 
          href="/" 
          className="pointer-events-auto text-[var(--g3-ink)] hover:opacity-70 transition-opacity flex items-center gap-2"
          aria-label="Back to Home"
        >
          <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" aria-hidden="true" />
        </Link>
        <div className="pointer-events-auto flex items-center gap-2">
          <G3SocialsDropdown className="flex p-2 shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-[var(--g3-ink)]" />
          <div className="bg-black/5 dark:bg-white/5 backdrop-blur-md rounded-full border border-black/10 dark:border-white/10 text-[var(--g3-ink)]">
            <AnimatedThemeToggler />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6">
        
        {/* HEADER */}
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-black/10 dark:border-white/10 pb-8 transition-colors duration-300">
          <div>
            {/* Above the fold, so these use the CSS entrance (g3-enter in
                g3-theme.css) rather than <Reveal>, which keeps them invisible
                until JavaScript has hydrated. */}
            <h1 className="g3-enter g3-display-xl text-foreground transition-colors duration-300">Portfolio</h1>
            <p className="g3-enter g3-enter-1 g3-body mt-4 max-w-xl !text-muted-foreground transition-colors duration-300">
              Explore our selected works across coastal Karnataka, ranging from residential builds to commercial spaces and interior execution.
            </p>
          </div>
        </div>

        {/* PROJECTS GRID */}
        {!allImages.length ? (
          <Reveal delay={0.3}>
            <div className="py-32 text-center flex flex-col items-center">
              <p className="text-2xl font-light opacity-60 mb-6 text-foreground transition-colors duration-300">
                Projects are being added — check back shortly.
              </p>
              <Link href="/" className="g3-link text-foreground transition-colors duration-300">
                Return to Home <ChevronRight aria-hidden="true" className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="g3-enter g3-enter-3">
            <MouseScaleGallery images={allImages} />
          </div>
        )}

      </div>
    </div>
  );
}
