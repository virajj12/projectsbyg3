import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/g3-data";
import { absoluteUrl } from "@/lib/site";

/**
 * /sitemap.xml: every canonical, indexable URL and nothing else. No query
 * strings, fragments or redirecting paths. Project URLs come from the same
 * content that generates the pages, so the two cannot disagree.
 *
 * lastModified is only given where the site states a real date (the privacy
 * policy's "Last updated"). The content has no per-project edit dates, and
 * a made-up date would teach Google to ignore the field.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();

  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/projects"), changeFrequency: "monthly", priority: 0.8 },
    ...projects.map((p) => ({
      url: absoluteUrl(`/projects/${p.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
      images: p.cover && p.cover.type !== "video" ? [absoluteUrl(p.cover.url)] : undefined,
    })),
    {
      url: absoluteUrl("/privacy"),
      lastModified: new Date("2026-09-24"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
