export const runtime = 'edge';

import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { getProjects } from "@/lib/g3-data";
import { Reveal } from "@/components/g3/Reveal";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import dynamic from 'next/dynamic';

const MouseScaleGallery = dynamic(() => import("@/components/g3/MouseScaleGallery"));

export default async function ProjectsPage() {
  const allProjects = await getProjects();
  
  // Extract all images from all projects
  const allImages = allProjects.flatMap(project => {
    const images = [];
    if (project.cover) {
      images.push({ ...project.cover, projectTitle: project.title, projectSlug: project.slug });
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
      <div className="fixed top-0 left-0 right-0 p-6 md:p-8 flex justify-between items-center z-50 pointer-events-none">
        <Link 
          href="/" 
          className="pointer-events-auto text-[var(--g3-ink)] hover:opacity-70 transition-opacity flex items-center gap-2"
          aria-label="Back to Home"
        >
          <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
        </Link>
        <div className="pointer-events-auto bg-black/5 dark:bg-white/5 backdrop-blur-md rounded-full border border-black/10 dark:border-white/10 text-[var(--g3-ink)]">
          <AnimatedThemeToggler />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6">
        
        {/* HEADER */}
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-black/10 dark:border-white/10 pb-8 transition-colors duration-300">
          <div>
            <Reveal>
              <h1 className="g3-display-xl text-foreground transition-colors duration-300">Portfolio</h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="g3-body mt-4 max-w-xl !text-muted-foreground transition-colors duration-300">
                Explore our selected works across coastal Karnataka, ranging from residential builds to commercial spaces and interior execution.
              </p>
            </Reveal>
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
          <Reveal delay={0.4}>
            <MouseScaleGallery images={allImages} />
          </Reveal>
        )}

      </div>
    </div>
  );
}
