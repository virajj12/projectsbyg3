"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

function Double({ images, reversed }: { images: any[]; reversed?: boolean }) {
  const firstImage = useRef<HTMLAnchorElement>(null);
  const secondImage = useRef<HTMLAnchorElement>(null);
  const requestAnimationFrameId = useRef<number | null>(null);
  
  const xPercent = useRef(reversed ? 100 : 0);
  const currentXPercent = useRef(reversed ? 100 : 0);
  const speed = 0.15;

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const manageMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    const { clientX } = e;
    xPercent.current = (clientX / window.innerWidth) * 100;
    
    if (!requestAnimationFrameId.current) {
      requestAnimationFrameId.current = window.requestAnimationFrame(animate);
    }
  };

  const animate = () => {
    const xPercentDelta = xPercent.current - currentXPercent.current;
    currentXPercent.current = currentXPercent.current + xPercentDelta * speed;
    
    const firstImagePercent = 66.66 - currentXPercent.current * 0.33;
    const secondImagePercent = 33.33 + currentXPercent.current * 0.33;
    
    if (firstImage.current && secondImage.current && window.innerWidth >= 768) {
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

  useEffect(() => {
    return () => {
      if (requestAnimationFrameId.current) {
        window.cancelAnimationFrame(requestAnimationFrameId.current);
      }
    };
  }, []);

  if (images.length === 1) {
    return (
      <Link
        href={`/projects/${images[0].projectSlug}`}
        className="group relative flex w-full h-[60vh] md:h-[45vw] overflow-hidden rounded-md mt-6 md:mt-[10vh]"
      >
        <Image
          src={images[0].url}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          alt={images[0].alt || images[0].projectTitle}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="absolute bottom-6 left-6 right-6 pointer-events-none md:translate-y-4 opacity-100 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
          <h3 className="g3-display-md text-white text-xl md:text-2xl">{images[0].projectTitle}</h3>
        </div>
      </Link>
    );
  }

  return (
    <div 
      onMouseMove={manageMouseMove} 
      className="flex flex-col md:flex-row gap-4 md:gap-6 mt-6 md:mt-[10vh] h-auto md:h-[45vw]"
    >
      <Link
        href={`/projects/${images[0].projectSlug}`}
        ref={firstImage} 
        className="group relative block overflow-hidden rounded-md transition-all duration-[30ms] ease-linear w-full h-[60vh] md:h-full md:w-auto"
        style={isMobile ? { width: '100%' } : { width: reversed ? "33.33%" : "66.66%" }}
      >
        <Image
          src={images[0].url}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          alt={images[0].alt || images[0].projectTitle}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="absolute bottom-6 left-6 right-6 pointer-events-none md:translate-y-4 opacity-100 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
          <h3 className="g3-display-md text-white text-xl md:text-2xl">{images[0].projectTitle}</h3>
        </div>
      </Link>

      <Link
        href={`/projects/${images[1].projectSlug}`}
        ref={secondImage} 
        className="group relative block overflow-hidden rounded-md transition-all duration-[30ms] ease-linear w-full h-[60vh] md:h-full md:w-auto"
        style={isMobile ? { width: '100%' } : { width: reversed ? "66.66%" : "33.33%" }}
      >
        <Image
          src={images[1].url}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          alt={images[1].alt || images[1].projectTitle}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="absolute bottom-6 left-6 right-6 pointer-events-none md:translate-y-4 opacity-100 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
          <h3 className="g3-display-md text-white text-xl md:text-2xl">{images[1].projectTitle}</h3>
        </div>
      </Link>
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
