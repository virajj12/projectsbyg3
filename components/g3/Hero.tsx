"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import type { G3Image } from "@/lib/g3-constants";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export default function Hero({
  heroImage,
  headline,
  tagline,
}: {
  heroImage: G3Image | null;
  headline: string;
  tagline: string;
}) {
  const { scrollY } = useScroll();
  const [windowSize, setWindowSize] = useState({ w: 1000, h: 800 });

  useEffect(() => {
    const updateSize = () => {
      setWindowSize({
        w: document.documentElement.clientWidth,
        h: document.documentElement.clientHeight,
      });
    };
    updateSize(); // initial set
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Distance to complete the scroll animation (in px)
  const SCROLL_DISTANCE = 400;

  // Navbar logo width: 144px on desktop, 112px on mobile
  const isDesktop = windowSize.w >= 768;
  const finalWidth = isDesktop ? 144 : 112;
  const finalHeight = finalWidth / 2; // Aspect ratio is 2:1

  // Center logo width: 45% of viewport width, capped at 340px
  const initialWidth = Math.min(windowSize.w * 0.45, 340);
  const initialHeight = initialWidth / 2;
  const scaleRatio = initialWidth / finalWidth;

  // Navbar padding: p-8 (32px) on desktop, p-6 (24px) on mobile
  const padding = isDesktop ? 32 : 24;

  // To center the scaled logo, its top-left corner must be exactly here:
  const targetX = windowSize.w / 2 - initialWidth / 2;
  const targetY = windowSize.h / 2 - initialHeight / 2;

  // Since the base element is already offset by `padding` (due to the container padding),
  // we subtract `padding` from the target coordinates.
  const x = useTransform(scrollY, [0, SCROLL_DISTANCE], [targetX - padding, 0]);
  const y = useTransform(scrollY, [0, SCROLL_DISTANCE], [targetY - padding, 0]);
  const scale = useTransform(scrollY, [0, SCROLL_DISTANCE], [scaleRatio, 1]);

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-[var(--g3-black)]">
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

      {/* Fixed Navbar Area - Persists across the whole page */}
      <div className="fixed top-0 left-0 right-0 p-6 md:p-8 flex justify-between items-center z-[41] pointer-events-none">
        {/* Animated Logo */}
        <motion.div
          className="relative pointer-events-auto origin-top-left"
          style={{ x, y, scale, width: finalWidth, height: finalHeight }}
        >
          <Image
            src="/G3 B & A LOGO BLACK.png"
            alt="G3 Builders Logo"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-contain dark:hidden"
            priority
          />
          <Image
            src="/G3 B & A LOGO WHITE.png"
            alt="G3 Builders Logo"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-contain hidden dark:block"
            priority
          />
        </motion.div>

        {/* Theme Toggler */}
        <div className="pointer-events-auto bg-black/5 dark:bg-white/5 backdrop-blur-md rounded-full border border-black/10 dark:border-white/10 text-[var(--g3-ink)]">
          <AnimatedThemeToggler />
        </div>
      </div>
    </section>
  );
}
