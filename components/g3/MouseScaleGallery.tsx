"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";

function Double({ images, reversed }: { images: any[]; reversed?: boolean }) {
  const firstImage = useRef<HTMLDivElement>(null);
  const secondImage = useRef<HTMLDivElement>(null);
  const requestAnimationFrameId = useRef<number | null>(null);
  
  const xPercent = useRef(reversed ? 100 : 0);
  const currentXPercent = useRef(reversed ? 100 : 0);
  const speed = 0.15;

  const manageMouseMove = (e: React.MouseEvent) => {
    const { clientX } = e;
    xPercent.current = (clientX / window.innerWidth) * 100;
    
    if (!requestAnimationFrameId.current) {
      requestAnimationFrameId.current = window.requestAnimationFrame(animate);
    }
  };

  const animate = () => {
    const xPercentDelta = xPercent.current - currentXPercent.current;
    currentXPercent.current = currentXPercent.current + xPercentDelta * speed;
    
    // Change width of images between 33.33% and 66.66% based on cursor
    const firstImagePercent = 66.66 - currentXPercent.current * 0.33;
    const secondImagePercent = 33.33 + currentXPercent.current * 0.33;
    
    if (firstImage.current && secondImage.current) {
      firstImage.current.style.width = `${firstImagePercent}%`;
      secondImage.current.style.width = `${secondImagePercent}%`;
    }
    
    if (Math.round(xPercent.current) === Math.round(currentXPercent.current)) {
      if (requestAnimationFrameId.current) {
        window.cancelAnimationFrame(requestAnimationFrameId.current);
        requestAnimationFrameId.current = null;
      }
    } else {
      requestAnimationFrameId.current = window.requestAnimationFrame(animate);
    }
  };

  // Ensure cleanup
  useEffect(() => {
    return () => {
      if (requestAnimationFrameId.current) {
        window.cancelAnimationFrame(requestAnimationFrameId.current);
      }
    };
  }, []);

  if (images.length === 1) {
    // Render full width if only one image
    return (
      <div
        className="group relative flex w-full h-[60vh] sm:h-[45vw] overflow-hidden rounded-md mt-6 sm:mt-[10vh]"
      >
        <Image
          src={images[0].url}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          alt={images[0].alt || images[0].projectTitle}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="absolute bottom-6 left-6 right-6 pointer-events-none translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
          <h3 className="g3-display-md text-white text-lg sm:text-2xl">{images[0].projectTitle}</h3>
        </div>
      </div>
    );
  }

  return (
    <div 
      onMouseMove={manageMouseMove} 
      className="flex gap-4 sm:gap-6 mt-6 sm:mt-[10vh] h-[50vh] sm:h-[45vw]"
    >
      <div
        ref={firstImage} 
        className="group relative block overflow-hidden rounded-md transition-all duration-[30ms] ease-linear"
        style={{ width: reversed ? "33.33%" : "66.66%" }}
      >
        <Image
          src={images[0].url}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          alt={images[0].alt || images[0].projectTitle}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="absolute bottom-6 left-6 right-6 pointer-events-none translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
          <h3 className="g3-display-md text-white text-lg sm:text-2xl">{images[0].projectTitle}</h3>
        </div>
      </div>

      <div
        ref={secondImage} 
        className="group relative block overflow-hidden rounded-md transition-all duration-[30ms] ease-linear"
        style={{ width: reversed ? "66.66%" : "33.33%" }}
      >
        <Image
          src={images[1].url}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          alt={images[1].alt || images[1].projectTitle}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="absolute bottom-6 left-6 right-6 pointer-events-none translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
          <h3 className="g3-display-md text-white text-lg sm:text-2xl">{images[1].projectTitle}</h3>
        </div>
      </div>
    </div>
  );
}

export default function MouseScaleGallery({ images }: { images: any[] }) {
  // Chunk images into arrays of 2
  const chunks: any[][] = [];
  for (let i = 0; i < images.length; i += 2) {
    chunks.push(images.slice(i, i + 2));
  }

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-6 pb-24">
      {chunks.map((chunk, index) => {
        const isReversed = index % 2 !== 0;
        return (
          <Double 
            key={chunk[0].url} 
            images={chunk} 
            reversed={isReversed} 
          />
        );
      })}
    </div>
  );
}
