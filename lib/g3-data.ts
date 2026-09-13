export const runtime = 'edge';

import { G3_CATEGORIES, type G3Image, type G3Project, type G3GalleryItem } from "./g3-constants";

export { G3_CATEGORIES };
export type { G3Image, G3Project, G3GalleryItem };

// Ensure we don't throw if the env isn't strictly loaded
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://verspektive.in";

async function fetchFromAPI<T>(action: string, params: Record<string, string> = {}): Promise<T | null> {
  try {
    const url = new URL(`${API_URL}/api/g3/public/data`);
    url.searchParams.set("action", action);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
    
    // next: { revalidate: 60 } caches the request for 60 seconds.
    const res = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (!res.ok) {
      console.error(`G3 fetch ${action} failed: ${res.status} ${res.statusText}`);
      return null;
    }
    return res.json() as Promise<T>;
  } catch (error) {
    console.error(`G3 fetch ${action} network error:`, error);
    return null;
  }
}

export async function getProjects(category?: string): Promise<G3Project[]> {
  const params: Record<string, string> = category ? { category } : {};
  const data = await fetchFromAPI<G3Project[]>("projects", params);
  return data || [];
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
  const data = await fetchFromAPI<any>("projectBySlug", { slug });
  return data || null;
}

export async function getServices(): Promise<any[]> {
  const data = await fetchFromAPI<any[]>("services");
  return data || [];
}

export async function getTeam(): Promise<any[]> {
  const data = await fetchFromAPI<any[]>("team");
  return data || [];
}

export async function getTestimonials(): Promise<any[]> {
  const data = await fetchFromAPI<any[]>("testimonials");
  return data || [];
}

export async function getPageContent(slug: string): Promise<{
  content: Record<string, string>;
  heroImage: G3Image | null;
}> {
  const data = await fetchFromAPI<any>("pageContent", { slug });
  return data || { content: {}, heroImage: null };
}

export async function getStats(): Promise<{
  projects: number;
  sqft: number;
  cities: number;
  yearsActive: number;
}> {
  const data = await fetchFromAPI<any>("stats");
  return data || { projects: 0, sqft: 0, cities: 0, yearsActive: 0 };
}
