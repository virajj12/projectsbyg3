"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function StickyLogo() {
  const { scrollY } = useScroll();
  const [windowHeight, setWindowHeight] = useState(800);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fade in over 100px of scrolling after the top of the services section reaches the top of the page.
  // The services section starts right after the hero, which is 100vh tall.
  const opacity = useTransform(scrollY, [windowHeight, windowHeight + 100], [0, 1]);
  // Also slide it down slightly
  const y = useTransform(scrollY, [windowHeight, windowHeight + 100], [-20, 0]);

  return (
    <motion.div 
      className="sticky top-0 z-[41] w-full h-0 overflow-visible pointer-events-none"
      style={{ opacity, y }}
    >
      {/* Decorative repeat of the hero logo (the page's h1), hidden until the
          hero scrolls away, so it is neither preloaded nor announced. */}
      <div className="p-6 md:p-8 flex justify-start items-center w-full">
        <div className="relative pointer-events-auto w-[63px] md:w-[81px] aspect-[2/1]">
          <Image
            src="/G3 black.png"
            alt=""
            fill
            sizes="(max-width: 767px) 63px, 81px"
            className="object-contain dark:hidden"
          />
          <Image
            src="/G3 white.png"
            alt=""
            fill
            sizes="(max-width: 767px) 63px, 81px"
            className="object-contain hidden dark:block"
          />
        </div>
      </div>
    </motion.div>
  );
}
