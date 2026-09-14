"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"animating" | "logo-fading" | "fading-out">("animating");

  useEffect(() => {
    // 1. Logo slides up (takes ~0.7s).
    // 2. Start logo fade out at 0.8s
    const logoFadeOutTimer = setTimeout(() => {
      setPhase("logo-fading");
    }, 800);

    // 3. Start background fade out at 1.1s
    const backgroundFadeOutTimer = setTimeout(() => {
      setPhase("fading-out");
    }, 1100);

    // 4. Completely unmount at 1.6s
    const removeTimer = setTimeout(() => {
      onComplete();
    }, 1600);

    return () => {
      clearTimeout(logoFadeOutTimer);
      clearTimeout(backgroundFadeOutTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  return (
    <>
      <style>
        {`
          @keyframes slideUpMask {
            0% { transform: translateY(110%); }
            100% { transform: translateY(0); }
          }
          .animate-slide-up-mask {
            animation: slideUpMask 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}
      </style>
      {/* Background Layer */}
      <div
        className={`fixed inset-0 z-[999] bg-black pointer-events-none transition-opacity duration-500 ease-in-out ${
          phase === "fading-out" ? "opacity-0" : "opacity-100"
        }`}
      />
      
      {/* Logo Layer */}
      <div
        className={`fixed inset-0 z-[1000] flex items-center justify-center pointer-events-none transition-opacity duration-300 ease-in-out ${
          phase === "logo-fading" || phase === "fading-out" ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className="relative h-24 w-48 sm:h-32 sm:w-64 md:h-40 md:w-80 flex-shrink-0 animate-slide-up-mask"
          >
            <Image
              src="/G3 White & Grey-01-01.png"
              alt="G3 Builders Logo"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </>
  );
}
