"use client";

import Link from "next/link";
import { MailDropdown } from "@/components/ui/mail-dropdown";
import { useRouter } from "next/navigation";

export default function G3Footer() {
  const router = useRouter();
  return (
    <footer id="g3-footer" className="relative overflow-hidden transition-colors duration-300 border-t border-black/10 dark:border-white/10">
      
      {/* Top Section - Follows Page Theme */}
      <div className="bg-background text-foreground flex flex-col transition-colors duration-300 min-h-[40vh] md:min-h-[50vh]">
        
        {/* Details Centered Vertically */}
        <div className="flex-1 flex flex-col justify-center items-center py-12 md:py-0">
          <div className="flex flex-col items-center text-center space-y-6">
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

        {/* Navigation Pushed to Bottom */}
        <div className="w-full px-2 lg:px-4 pb-4 md:pb-6">
          <div className="flex flex-col md:flex-row md:justify-between items-center gap-6 font-medium text-lg">
            <Link href="/" className="hover:text-muted-foreground transition-colors">Home</Link>
            <Link href="/projects" className="hover:text-muted-foreground transition-colors">Projects</Link>
            <button onClick={() => document.getElementById('services') ? document.getElementById('services')!.scrollIntoView({ behavior: 'smooth' }) : router.push("/")} className="hover:text-muted-foreground transition-colors">Services</button>
            <button onClick={() => document.getElementById('process') ? document.getElementById('process')!.scrollIntoView({ behavior: 'smooth' }) : router.push("/")} className="hover:text-muted-foreground transition-colors">Process</button>
            <button onClick={() => document.getElementById('about') ? document.getElementById('about')!.scrollIntoView({ behavior: 'smooth' }) : router.push("/")} className="hover:text-muted-foreground transition-colors">About</button>
          </div>
        </div>
        
        {/* Mobile Bottom Row (Inside White Area) */}
        <div className="mt-16 flex flex-col md:hidden items-center gap-4 px-6 py-5 text-[11px] font-medium tracking-wide text-muted-foreground border-t border-black/10 dark:border-white/10">
          <span>© {new Date().getFullYear()} G3 Builders & Architects</span>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <a href="https://verspektive.in/tech" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">Website by VerspeKtive Tech</a>
          </div>
        </div>
      </div>

      {/* Bottom Section - Always Dark Grey & White text */}
      <div className="bg-zinc-900 text-white pt-6 pb-6 md:pt-6 md:pb-0">
        <div className="w-full px-0 flex flex-col">
          
          {/* MASSIVE LOGO - using Oswald, all one line */}
          <div className="w-full flex justify-center items-center pointer-events-none">
            <div 
              className="w-full text-center uppercase tracking-tighter leading-none text-white"
              style={{ 
                fontFamily: "var(--font-oswald), sans-serif", 
                fontWeight: 700,
              }}
            >
              <div className="whitespace-nowrap w-full text-center leading-none">
                <span className="md:hidden text-[33vw]">G3B&A</span>
                <span className="hidden md:inline text-[8.6vw]">G3 BUILDERS & ARCHITECTS</span>
              </div>
            </div>
          </div>

        </div>

        {/* Desktop Bottom Row */}
        <div className="mt-4 md:mt-6 hidden md:flex flex-row justify-between items-center gap-4 px-6 lg:px-12 py-5 text-xs font-medium tracking-wide text-zinc-400 border-t border-white/10 bg-black/20">
          <span>© {new Date().getFullYear()} G3 Builders & Architects</span>
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <a href="https://verspektive.in/tech" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Website by VerspeKtive Tech</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
