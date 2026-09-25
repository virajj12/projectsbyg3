"use client";

import Link from "next/link";
import { MailDropdown } from "@/components/ui/mail-dropdown";
import { useRouter } from "next/navigation";

export default function G3Footer() {
  const router = useRouter();
  return (
    <footer id="g3-footer" className="relative overflow-hidden transition-colors duration-300">
      
      {/* Top Section - Follows Page Theme */}
      <div className="bg-background text-foreground pt-16 md:pt-32 pb-6 md:pb-24 transition-colors duration-300">
        <div className="mx-auto max-w-[90rem] px-6 lg:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 text-center md:text-left">
          
          {/* Navigation */}
          <div className="md:col-span-6 lg:col-span-6 font-medium text-lg space-y-3 flex flex-col items-center md:items-start w-full">
            <div className="flex flex-col gap-3 items-center md:items-start">
              <Link href="/" className="hover:text-muted-foreground transition-colors">Home</Link>
              <Link href="/projects" className="hover:text-muted-foreground transition-colors">Projects</Link>
              <button onClick={() => document.getElementById('services') ? document.getElementById('services')!.scrollIntoView({ behavior: 'smooth' }) : router.push("/")} className="hover:text-muted-foreground transition-colors">Services</button>
              <button onClick={() => document.getElementById('process') ? document.getElementById('process')!.scrollIntoView({ behavior: 'smooth' }) : router.push("/")} className="hover:text-muted-foreground transition-colors">Process</button>
              <button onClick={() => document.getElementById('about') ? document.getElementById('about')!.scrollIntoView({ behavior: 'smooth' }) : router.push("/")} className="hover:text-muted-foreground transition-colors">About</button>
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-6 lg:col-span-6 space-y-6 flex flex-col items-center md:items-start w-full">
            <div>
              <address className="not-italic text-sm md:text-base leading-relaxed">
                Moodbidri<br />
                Coastal Karnataka<br />
                India
              </address>
            </div>
            <div>
              <MailDropdown email="hey@verspektive.in">
                <span className="text-sm md:text-base hover:underline cursor-pointer">hey@verspektive.in</span>
              </MailDropdown>
            </div>
          </div>
        </div>
        
        {/* Mobile Bottom Row (Inside White Area) */}
        <div className="mt-16 flex flex-col md:hidden items-center gap-4 px-6 py-5 text-[11px] font-medium tracking-wide text-muted-foreground border-t border-black/10 dark:border-white/10">
          <span>© {new Date().getFullYear()} G3B&A</span>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <a href="https://verspektive.in" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">Website by VerspeKtive</a>
          </div>
        </div>
      </div>

      {/* Bottom Section - Always Dark Grey & White text */}
      <div className="bg-zinc-900 text-white pt-12 md:pt-16 pb-8 md:pb-0">
        <div className="mx-auto max-w-[90rem] px-6 lg:px-12 flex flex-col">
          
          {/* MASSIVE LOGO - using Oswald, all one line */}
          <div className="w-full flex justify-center items-center pointer-events-none pb-2">
            <div 
              className="w-full text-center uppercase tracking-tighter leading-none text-white"
              style={{ 
                fontFamily: "var(--font-oswald), sans-serif", 
                fontWeight: 700,
              }}
            >
              <div className="whitespace-nowrap w-full text-center leading-none">
                <span className="md:hidden" style={{ fontSize: "clamp(3rem, 25vw, 150px)" }}>G3B&A</span>
                <span className="hidden md:inline" style={{ fontSize: "clamp(2rem, 7.8vw, 112px)" }}>G3 BUILDERS & ARCHITECTS</span>
              </div>
            </div>
          </div>

        </div>

        {/* Desktop Bottom Row */}
        <div className="mt-8 hidden md:flex flex-row justify-between items-center gap-4 px-6 lg:px-12 py-5 text-xs font-medium tracking-wide text-zinc-400 border-t border-white/10 bg-black/20">
          <span>© {new Date().getFullYear()} G3 Builders & Architects</span>
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <a href="https://verspektive.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Website by VerspeKtive</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
