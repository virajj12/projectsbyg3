"use client";

import Image from "next/image";
import type { G3Image } from "@/lib/g3-constants";

export default function Hero({
  heroImage,
  headline,
  tagline,
}: {
  heroImage: G3Image | null;
  headline: string;
  tagline: string;
}) {
  return (
    <section className="sticky top-0 z-0 h-[100svh] w-full overflow-hidden bg-[var(--g3-black)] flex items-center justify-center">
      {heroImage ? (
        <Image
          src={heroImage.url}
          alt={heroImage.alt || "G3 Builders flagship project"}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="g3-surface-black absolute inset-0" />
      )}

      <div
        className="absolute inset-0 bg-gradient-to-t from-[#fcfcfc]/95 via-[#fcfcfc]/45 to-[#fcfcfc]/70 dark:from-[#0a0908]/95 dark:via-[#0a0908]/45 dark:to-[#0a0908]/70"
      />

      <div className="relative z-10 w-[25vw] max-w-[191px] aspect-[2/1]">
        <Image
          src="/G3 black.png"
          alt="G3 Builders Logo"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-contain dark:hidden"
          priority
        />
        <Image
          src="/G3 white.png"
          alt="G3 Builders Logo"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-contain hidden dark:block"
          priority
        />
      </div>
    </section>
  );
}
