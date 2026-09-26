import type { MetadataRoute } from "next";
import { SITE_URL, absoluteUrl } from "@/lib/site";

/**
 * /robots.txt. Everything public is crawlable; only the enquiry endpoint,
 * which answers POST and has nothing to index, is excluded.
 *
 * Next's own /_next/ assets are deliberately not blocked: Google needs the
 * scripts and styles to render the pages it indexes.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
