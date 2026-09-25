"use client";

import React, { useEffect, useState } from "react";

const words = ["G3", "Builders", "&", "Architects"];

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"animating" | "text-hidden" | "fading-out">("animating");

  useEffect(() => {
    // Flash each word for 350ms (hard cut)
    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev < words.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 350);

    // Hide the final word at 1.4s (350ms * 4 words)
    const textHideTimer = setTimeout(() => {
      setPhase("text-hidden");
    }, 1400);

    // Fade out the whole screen shortly after the text is gone
    const backgroundFadeOutTimer = setTimeout(() => {
      setPhase("fading-out");
    }, 1600);

    // Completely unmount at 2.3s
    const removeTimer = setTimeout(() => {
      onComplete();
    }, 2300);

    return () => {
      clearInterval(interval);
      clearTimeout(textHideTimer);
      clearTimeout(backgroundFadeOutTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  return (
    <>
      {/* Background Layer */}
      <div
        className={`fixed inset-0 z-[999] bg-black pointer-events-none transition-opacity duration-700 ease-in-out ${
          phase === "fading-out" ? "opacity-0" : "opacity-100"
        }`}
      />
      
      {/* Text Layer */}
      <div
        className={`fixed inset-0 z-[1000] flex items-center justify-center pointer-events-none ${
          phase !== "animating" ? "opacity-0" : "opacity-100"
        }`}
      >
        <div 
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tighter"
          style={{ fontFamily: "var(--g3-font-display)" }}
        >
          {words[index]}
        </div>
      </div>
    </>
  );
}
