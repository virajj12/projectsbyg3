import Image from "next/image";
import type { G3Image } from "@/lib/g3-constants";

/**
 * Full-screen hero. A server component: nothing here needs the browser, so it
 * ships no JavaScript.
 *
 * The logo is the page's <h1>. Its text is the business name, carried by the
 * visually hidden span because the logo artwork itself only reads "G3". The
 * two logo images are decorative (alt="") so the name is not announced twice.
 *
 * Only one of the two theme variants is ever visible, so neither is preloaded:
 * lazy loading skips the one hidden with display:none, and fetchPriority
 * raises the visible one (per the next/image docs on theme-specific images).
 * `sizes` matches the rendered width, 25vw capped at 191px, rather than
 * requesting a screen-wide image for a small logo.
 */
export default function Hero({
  heroImage,
}: {
  heroImage: G3Image | null;
  headline?: string;
  tagline?: string;
}) {
  return (
    <section className="sticky top-0 z-0 h-[100svh] w-full overflow-hidden bg-[var(--g3-black)] flex items-center justify-center">
      {heroImage ? (
        <Image
          src={heroImage.url}
          alt={heroImage.alt || "G3 Builders flagship project"}
          fill
          preload
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="g3-surface-black absolute inset-0" />
      )}

      <div
        className="absolute inset-0 bg-gradient-to-t from-[#fcfcfc]/95 via-[#fcfcfc]/45 to-[#fcfcfc]/70 dark:from-[#0a0908]/95 dark:via-[#0a0908]/45 dark:to-[#0a0908]/70"
      />

      <h1 className="relative z-10 w-[25vw] max-w-[191px] aspect-[2/1]">
        <span className="sr-only">G3 Builders &amp; Architects</span>
        <Image
          src="/G3 black.png"
          alt=""
          fill
          sizes="(max-width: 764px) 25vw, 191px"
          fetchPriority="high"
          className="object-contain dark:hidden"
        />
        <Image
          src="/G3 white.png"
          alt=""
          fill
          sizes="(max-width: 764px) 25vw, 191px"
          fetchPriority="high"
          className="object-contain hidden dark:block"
        />
      </h1>
    </section>
  );
}
