/**
 * Site identity and the helpers every page uses for its SEO metadata, so the
 * canonical origin, titles and social cards are defined once and cannot drift
 * between pages.
 *
 * Only facts that are already published on the site belong here. Structured
 * data built from these values is read by search engines as a claim about
 * the business, so nothing is added that the pages themselves do not say.
 */

import type { Metadata } from "next";

/**
 * Canonical origin, without a trailing slash.
 *
 * Order: an explicit NEXT_PUBLIC_SITE_URL (set this when a custom domain goes
 * live), then Vercel's production domain, which Vercel exposes at build and
 * run time and which already prefers a custom domain once one is attached,
 * then the current production address. Preview deployments therefore still
 * point their canonicals at production rather than at themselves.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const raw = explicit || (vercel ? `https://${vercel}` : "https://projectsbyg3.vercel.app");
  return raw.replace(/\/+$/, "");
}

export const SITE_URL = resolveSiteUrl();
export const SITE_NAME = "G3 Builders & Architects";
export const SITE_DESCRIPTION =
  "Exterior design consultancy, interior planning and execution delivered end to end. Residential and commercial projects across coastal Karnataka.";
export const SITE_LOCALE = "en_IN";
export const EMAIL = "hey@verspektive.in";
export const INSTAGRAM_URL = "https://www.instagram.com/projects_by_g3";

/** A real G3 project photograph, used when a page has no image of its own. */
export const DEFAULT_SHARE_IMAGE = {
  url: "/images/projects/Mantradi 1.jpg",
  width: 1920,
  height: 1080,
  alt: "Residence at Mantradi by G3 Builders & Architects",
};

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Absolute URL for a site path. Spaces in public file names are encoded. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, `${SITE_URL}/`).toString();
}

type ShareImage = { url: string; alt?: string; width?: number; height?: number };

/**
 * Full metadata for one indexable page: title, description, self-referencing
 * canonical, and matching Open Graph / Twitter cards.
 *
 * Next merges `openGraph` and `twitter` shallowly, so a page that sets either
 * replaces the layout's version entirely; building both here keeps every page
 * complete. `title` is the page's own name; the layout template appends the
 * site name, and `absoluteTitle` opts out of that for the home page.
 */
export function pageMetadata({
  title,
  description,
  path,
  images,
  absoluteTitle = false,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  images?: ShareImage[];
  absoluteTitle?: boolean;
  type?: "website" | "article";
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} · ${SITE_NAME}`;
  const shareImages = images && images.length ? images : [DEFAULT_SHARE_IMAGE];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      title: fullTitle,
      description,
      images: shareImages,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: shareImages.map((i) => ({ url: i.url, alt: i.alt })),
    },
  };
}

/**
 * Serialises structured data for a <script type="application/ld+json">.
 * `<` is escaped so no string in the data can close the script element.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** BreadcrumbList for a page, given its trail from the home page down. */
export function breadcrumbList(trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/**
 * Project titles are written "Name | Place" (e.g. "Residence | Mantradi").
 * The place is the part after the bar. The separate `location` field in the
 * content holds placeholders such as "Confidential" or "Internal", so it is
 * never used as a place name.
 */
export function projectPlace(title: string): string | null {
  const parts = title.split("|");
  return parts.length > 1 ? parts[parts.length - 1].trim() || null : null;
}
