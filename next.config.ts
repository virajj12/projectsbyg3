import type { NextConfig } from "next";

/**
 * Security headers that do not change how pages render or how Google crawls
 * them. A full script Content-Security-Policy is deliberately not set: the
 * theme script, JSON-LD and Next's inline bootstrap would all need nonces,
 * which forces every page to render per request. The directives below only
 * restrict <base>, form targets and plugins.
 *
 * Framing is not restricted (no X-Frame-Options / frame-ancestors) in case
 * the site is embedded elsewhere, e.g. as a portfolio piece; add
 * "frame-ancestors 'self'" once it is known that nothing embeds it.
 *
 * HSTS is already sent by Vercel for this deployment, so it is not repeated.
 */
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  {
    key: "Content-Security-Policy",
    value: "base-uri 'self'; form-action 'self'; object-src 'none'",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // AVIF first (typically 20-30% smaller than WebP for photographs), WebP
    // for browsers without it; next/image picks per request via Accept.
    formats: ["image/avif", "image/webp"],
    // The source photos rarely change, so keep optimised copies for 31 days
    // instead of re-encoding them every few hours.
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "verspektive.in",
      }
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      {
        // Unhashed files in public/: cache for a day and revalidate in the
        // background for a week, so a replaced photo still shows up promptly.
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
};

export default nextConfig;
