import { G3_CATEGORIES, type G3Image, type G3Project, type G3GalleryItem } from "./g3-constants";

// Import local JSON content
import projectsData from "../content/projects.json";
import servicesData from "../content/services.json";
import pagesData from "../content/pages.json";
import statsData from "../content/stats.json";

export { G3_CATEGORIES };
export type { G3Image, G3Project, G3GalleryItem };

export async function getProjects(category?: string): Promise<G3Project[]> {
  const all = projectsData as G3Project[];
  if (category) {
    return all.filter(p => p.category === category);
  }
  return all;
}

export async function getFeaturedProjects(limit = 4): Promise<G3Project[]> {
  const all = await getProjects();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getProjectBySlug(slug: string): Promise<{
  project: G3Project;
  gallery: G3GalleryItem[];
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
} | null> {
  const all = await getProjects();
  const index = all.findIndex((p) => p.slug === slug);
  if (index === -1) return null;

  const project = all[index];
  
  // Cast back to any to read the 'gallery' property we added to our JSON
  const rawProject = projectsData.find((p) => p.slug === slug) as any;
  const gallery: G3GalleryItem[] = rawProject?.gallery || [];

  const prevProject = index > 0 ? all[index - 1] : null;
  const nextProject = index < all.length - 1 ? all[index + 1] : null;

  return {
    project,
    gallery,
    prev: prevProject ? { slug: prevProject.slug, title: prevProject.title } : null,
    next: nextProject ? { slug: nextProject.slug, title: nextProject.title } : null,
  };
}

export async function getServices(): Promise<any[]> {
  return servicesData;
}

export async function getPageContent(slug: string): Promise<{
  content: Record<string, string>;
  heroImage: G3Image | null;
}> {
  const page = (pagesData as any)[slug];
  return page || { content: {}, heroImage: null };
}

export async function getStats(): Promise<{
  projects: number;
  sqft: number;
  cities: number;
  yearsActive: number;
}> {
  return statsData;
}
