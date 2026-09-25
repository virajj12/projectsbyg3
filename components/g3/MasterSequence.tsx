"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion, useMotionValueEvent, useMotionValue, useSpring, MotionValue } from "framer-motion";
import type { G3Project } from "@/lib/g3-data";
import ProjectCard from "./ProjectCard";
import { PROCESS_STAGES } from "./ProcessTimeline";
import MaskText from "@/components/MaskText";

interface MasterSequenceProps {
  projects: G3Project[];
  children?: React.ReactNode; // The CategoryFilter / Title
}

type Position = {
  zIndex: number;
  yRange: [string, string];
};

const POSITIONS: Position[] = [
  // 1. Top Left
  { zIndex: 10, yRange: ["40vh", "-40vh"] },
  // 2. Mid Left
  { zIndex: 11, yRange: ["20vh", "-20vh"] },
  // 3. Bottom Left
  { zIndex: 12, yRange: ["60vh", "-60vh"] },
  // 4. Top Center
  { zIndex: 13, yRange: ["70vh", "-70vh"] },
  // 5. Top Right
  { zIndex: 14, yRange: ["30vh", "-30vh"] },
  // 6. Mid Right
  { zIndex: 15, yRange: ["50vh", "-50vh"] },
  // 7. Bottom Right
  { zIndex: 5, yRange: ["80vh", "-80vh"] },
  // 8. Bottom Center
  { zIndex: 6, yRange: ["45vh", "-45vh"] },
];

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80",
];

function ParallaxImage({ src, pos, progress, index, mouseX }: { src: string; pos: Position; progress: any; index: number; mouseX?: MotionValue<number> }) {
  // Phase 1 is [0, 0.25] of the global MasterSequence scroll
  const y = useTransform(progress, [0, 0.25], pos.yRange);

  // Hover parallax based on mouse X. Inverted direction (negative factor).
  const factor = ((index % 3) + 1) * -15; // -15, -30, or -45px max offset
  const x = mouseX ? useTransform(mouseX, (v: number) => v * factor) : 0;

  return (
    <motion.div
      className={`absolute will-change-transform overflow-hidden shadow-2xl rounded-sm ms-img-${index}`}
      style={{
        zIndex: pos.zIndex,
        y,
        x,
      }}
    >
      <Image src={src} alt="Architecture portfolio" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
    </motion.div>
  );
}

function KineticStageTitle({ title, isActive }: { title: string, isActive: boolean }) {
  return (
    <motion.div
      className="shrink-0 stage-title-width"
      animate={{ opacity: isActive ? 1 : 0.3 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="text-[55px] md:text-[100px] font-semibold tracking-tight leading-none block">
        {title}
      </span>
    </motion.div>
  );
}

function KineticStageContent({ s, isActive }: { s: any, isActive: boolean }) {
  return (
    <motion.div
      className="absolute top-0 left-0 w-full pointer-events-none"
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-lg md:text-2xl font-light leading-snug mb-4 md:mb-6 opacity-90 min-h-[80px]">
        {isActive && <MaskText text={s.what} />}
      </div>
    </motion.div>
  );
}

function KineticStageNumber({ index, isActive }: { index: number, isActive: boolean }) {
  return (
    <motion.span
      className="absolute right-full mr-4 md:mr-6 top-1/2 -translate-y-1/2 text-sm md:text-base tracking-widest text-white/70 font-mono"
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.6 }}
    >
      {String(index + 1).padStart(2, "0")}
    </motion.span>
  );
}

export default function MasterSequence({ projects, children }: MasterSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const { scrollYProgress: entranceProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"]
  });

  // --- MOUSE TRACKING FOR PARALLAX ---
  const rawMouseX = useMotionValue(0);
  const smoothMouseX = useSpring(rawMouseX, { stiffness: 50, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    // Calculate mouse position relative to center of screen (-1 to 1)
    if (reduced) return;
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    rawMouseX.set(x);
  };

  // --- PHASE 1: PORTFOLIO OPACITY ---
  const portfolioOpacity = useTransform(scrollYProgress, [0.25, 0.30], [1, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0.26, 0.31], [1, 0]);
  const titleY = useTransform(entranceProgress, [0, 1], ["-30vh", "0vh"]);

  // --- PHASE 2: IMMERSIVE IMAGE TAKEOVER ---
  // The image starts as a "card" at the bottom right.
  // It moves up to the center from 0 to 0.25 without zooming, alongside the parallax images.
  // Then from 0.25 to 0.40 it expands to take over the screen.
  const imgWidth = useTransform(scrollYProgress, [0, 0.25, 0.40], ["28vw", "28vw", "100vw"]);
  const imgHeight = useTransform(scrollYProgress, [0, 0.25, 0.40], ["22vh", "22vh", "100vh"]);
  // Starts at 100vh, reaches 60vh (40% from bottom) before expanding.
  const imgTop = useTransform(scrollYProgress, [0, 0.25, 0.40], ["100vh", "60vh", "0vh"]);
  const imgLeft = useTransform(scrollYProgress, [0, 0.25, 0.40], ["45vw", "45vw", "0vw"]);
  const imgRadius = useTransform(scrollYProgress, [0, 0.25, 0.40], ["12px", "12px", "0px"]);
  const imgScale = useTransform(scrollYProgress, [0.25, 0.6], [1, 1.05]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["0vh", "0vh"]);

  // Z-index 25 ensures it is always in front of the parallax grid (z-index 20).
  // At 0.24, right before expanding, it jumps to 35 to expand *over* the title text (z-index 30).
  const imgZIndex = useTransform(scrollYProgress, (v) => (v > 0.24 ? 35 : 25));

  const panelY = useTransform(scrollYProgress, [0.45, 0.6], ["100vh", "0vh"]);
  const ctaDisplay = useTransform(scrollYProgress, [0.95, 0.96], ["none", "none"]);

  // Parallax for the immersive image during the horizontal text section (0.6 -> 0.95)
  const innerImgY = useTransform(scrollYProgress, [0.6, 0.95], ["10%", "-10%"]);

  const [activeIndex, setActiveIndex] = useState(0);

  const covers = projects.map((p) => p.cover?.url).filter((u): u is string => Boolean(u));

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.60) {
      if (activeIndex !== 0) setActiveIndex(0);
      return;
    }
    if (latest >= 0.95) {
      if (activeIndex !== 4) setActiveIndex(4);
      return;
    }

    // Each stage gets a 0.07 window (0.35 total range for 5 stages)
    const index = Math.floor((latest - 0.60) / 0.07);
    const safeIndex = Math.max(0, Math.min(4, index));
    if (activeIndex !== safeIndex) setActiveIndex(safeIndex);
  });

  if (reduced) {
    return (
      <div id="projects" className="w-full">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-12">{children}</div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative z-20 w-full bg-[var(--g3-black)]"
      style={{ height: "600vh" }}
      onMouseMove={handleMouseMove}
    >
      {/* Anchor for Projects (First half of the scroll) */}
      <div id="projects" className="absolute top-0 w-full h-[300vh] pointer-events-none" />
      {/* Anchor for Process (Second half of the scroll) */}
      <div id="process" className="absolute top-[300vh] w-full h-[300vh] pointer-events-none" />

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Explicit sibling background to ensure mix-blend-difference works reliably */}
        <div className="absolute inset-0 bg-[var(--g3-black)] pointer-events-none" />

        <style dangerouslySetInnerHTML={{
          __html: `
          /* MOBILE (Default) */
          .ms-img-0 { top: 0%; left: -5%; width: 45vw; height: 60vw; }
          .ms-img-1 { top: 42%; left: -5%; width: 28vw; height: 35vw; }
          .ms-img-2 { top: 65%; left: -5%; width: 40vw; height: 55vw; }
          .ms-img-3 { top: 2%; left: 55%; width: 35vw; height: 45vw; }
          .ms-img-4 { top: 22%; right: -5%; width: 30vw; height: 40vw; }
          .ms-img-5 { top: 50%; right: -2%; width: 25vw; height: 30vw; }
          .ms-img-6 { top: 70%; right: -5%; width: 45vw; height: 60vw; }
          .ms-img-7 { top: 85%; left: 30%; width: 35vw; height: 30vw; }

          .stage-slider { --stage-offset: 10vw; --stage-width: 85vw; }
          .stage-title-width { width: 85vw; }

          /* DESKTOP (>= 768px) */
          @media (min-width: 768px) {
            .ms-img-0 { top: 5%; left: 0%; width: 25vw; height: 45vh; }
            .ms-img-1 { top: 40%; left: 18%; width: 20vw; height: 28vh; }
            .ms-img-2 { top: 60%; left: 0%; width: 20vw; height: 35vh; }
            .ms-img-3 { top: 0%; left: 55%; width: 18vw; height: 40vh; }
            .ms-img-4 { top: 5%; right: 10%; width: 22vw; height: 20vh; }
            .ms-img-5 { top: 45%; right: 20%; width: 18vw; height: 27vh; }
            .ms-img-6 { top: 50%; right: 0%; width: 25vw; height: 50vh; }
            .ms-img-7 { top: 70%; left: 28%; width: 20vw; height: 25vh; }

            .stage-slider { --stage-offset: 15vw; --stage-width: 50vw; }
            .stage-title-width { width: 50vw; }
          }
        `}} />

        <motion.div
          className="absolute overflow-hidden shadow-2xl"
          style={{
            width: imgWidth,
            height: imgHeight,
            top: imgTop,
            left: imgLeft,
            y: imgY,
            borderRadius: imgRadius,
            zIndex: imgZIndex,
          }}
        >
          <motion.div className="absolute" style={{ top: "-15%", bottom: "-15%", left: 0, right: 0, scale: imgScale, y: innerImgY }}>
            <Image
              src="/images/projects/Salon 3.jpg"
              alt="Immersive architectural transition"
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </motion.div>
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30"
            style={{
              backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "4rem 4rem"
            }}
          />
        </motion.div>

        <motion.div className="absolute inset-0 z-20 pointer-events-none" style={{ opacity: portfolioOpacity }}>
          {POSITIONS.map((pos, i) => {
            // Fill the eight slots from G3's own covers, repeating them when a
            // category filter leaves fewer than eight. Stock photos are only a
            // last resort for a portfolio with no covers at all, so other
            // people's buildings never appear as G3 work.
            const src = covers.length ? covers[i % covers.length] : FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
            return (
              <div key={i} className="pointer-events-auto">
                <ParallaxImage src={src} pos={pos} progress={scrollYProgress} index={i} mouseX={smoothMouseX} />
              </div>
            );
          })}
        </motion.div>

        <motion.div
          className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center pt-[30vh] mix-blend-difference text-white"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          <div className="pointer-events-auto">
            {children}
          </div>
        </motion.div>

        {/* Phase 4 Content */}
        <motion.div
          className="absolute inset-0 z-40 text-white flex flex-col justify-center will-change-transform overflow-hidden"
          style={{ y: panelY }}
        >
          {/* Subtle gradient to ensure text readability over the immersive image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

          {/* Faint Architectural Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-10" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '100px 100px' }} />

          <div className="relative w-full h-[100dvh] md:h-[500px] z-20 -translate-y-8 md:-translate-y-24">

            {/* TOP HALF: Titles (Above the line) */}
            <div className="absolute bottom-[65%] md:bottom-[50%] left-0 w-full pb-4 md:pb-8">
              <motion.div
                className="flex items-end whitespace-nowrap w-max stage-slider"
                animate={{ x: `calc(var(--stage-offset) - calc(var(--stage-width) * ${activeIndex}))` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {PROCESS_STAGES.map((stage, i) => (
                  <KineticStageTitle key={i} title={stage.title} isActive={activeIndex === i} />
                ))}
              </motion.div>
            </div>

            {/* THE LINE & NUMBER (Center) */}
            <div className="absolute top-[35%] md:top-[50%] left-[15vw] md:left-[20vw] right-[5vw] md:right-[10vw] h-px bg-white/20">
              <div className="relative w-full h-full">
                {PROCESS_STAGES.map((_, i) => (
                  <KineticStageNumber key={i} index={i} isActive={activeIndex === i} />
                ))}
              </div>
            </div>

            {/* BOTTOM HALF: Descriptions (Below the line) */}
            <div className="absolute top-[35%] md:top-[50%] left-[15vw] md:left-auto right-[5vw] md:right-[10vw] w-auto md:w-[40vw] max-w-[500px] pt-6 md:pt-10">
              <div className="relative w-full h-full">
                {PROCESS_STAGES.map((s, i) => (
                  <KineticStageContent key={i} s={s} isActive={activeIndex === i} />
                ))}
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}
