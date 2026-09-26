"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, ChevronUp, ChevronDown, ChevronLeft } from "lucide-react";
import GlassSurface from "@/components/ui/GlassSurface";

const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#projects", label: "Projects" },
  { href: "#process", label: "Process" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function G3Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState<string>("");
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkBottom = () => {
      // Check if we are at the bottom of the page (within 20px)
      const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 20;
      setIsFooterVisible(isBottom);
    };

    window.addEventListener("scroll", checkBottom);
    window.addEventListener("resize", checkBottom);
    // Initial check
    checkBottom();

    return () => {
      window.removeEventListener("scroll", checkBottom);
      window.removeEventListener("resize", checkBottom);
    };
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!isScrollingRef.current) {
              setActiveHash(`#${entry.target.id}`);
            }
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" } // 20% slice in the middle of the screen
    );

    const observeLinks = () => {
      LINKS.forEach((l) => {
        const id = l.href.substring(1);
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      });
    };

    // Initial observation
    observeLinks();
    
    // Retry observation after mount in case of Next.js server components streaming
    const t1 = setTimeout(observeLinks, 500);
    const t2 = setTimeout(observeLinks, 2000);

    const handleScroll = () => {
      if (window.scrollY < 100 && !isScrollingRef.current) {
        setActiveHash("");
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  // Smooth scroll handler
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setActiveHash(href);
        isScrollingRef.current = true;
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false;
        }, 1000);
        element.scrollIntoView({ behavior: "smooth" });
        setOpen(false); // Close mobile menu if open
      } else {
        // The section lives on the home page (e.g. we're on /privacy), so go
        // there instead of swallowing the click.
        setOpen(false);
        router.push("/");
      }
    } else {
      setOpen(false);
    }
  };
  if (pathname.startsWith("/projects")) return null;

  if (pathname === "/privacy") {
    return (
      <motion.header
        className="sticky bottom-24 md:bottom-6 z-[44] flex justify-center w-full h-0 overflow-visible pointer-events-none"
        animate={{ width: "100%" }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute bottom-0 pointer-events-auto">
          <GlassSurface
            width="max-content"
            height="max-content"
            borderRadius={9999}
            className="p-2"
            opacity={0.35}
            brightness={40}
            blur={12}
          >
            {/* A real link to the home page. Visitors who came from within the
                site still go back in history as before; someone who landed
                here from a search result goes to the home page instead of
                being sent back out of the site. */}
            <Link
              href="/"
              onClick={(e) => {
                let fromThisSite = false;
                try {
                  fromThisSite = !!document.referrer && new URL(document.referrer).origin === window.location.origin;
                } catch {}
                if (fromThisSite && window.history.length > 1) {
                  e.preventDefault();
                  router.back();
                }
              }}
              className="flex items-center justify-center h-11 w-11 shrink-0 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-lg border border-black/10 dark:border-white/10 shadow-inner hover:bg-white/60 dark:hover:bg-black/60 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5 text-black dark:text-white" aria-hidden="true" />
            </Link>
          </GlassSurface>
        </div>
      </motion.header>
    );
  }

  return (
    <>
      <motion.header
        className="sticky bottom-24 md:bottom-6 z-[44] flex justify-center w-full h-0 overflow-visible pointer-events-none"
        animate={{ width: "100%" }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute bottom-0 pointer-events-auto">
        <GlassSurface
          width="max-content"
          height="max-content"
          borderRadius={9999}
          className="p-2"
          opacity={0.35}
          brightness={40}
          blur={12}
        >
          <div className="flex items-center gap-2">
            <AnimatePresence initial={false}>
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-1 overflow-hidden whitespace-nowrap bg-white/40 dark:bg-black/40 backdrop-blur-lg border border-black/10 dark:border-white/10 shadow-inner p-1 rounded-full mr-2"
              >
                <button
                  onClick={(e) => {
                    if (pathname === "/") {
                      e.preventDefault();
                      if (!isFooterVisible) {
                        isScrollingRef.current = true;
                        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
                        scrollTimeoutRef.current = setTimeout(() => {
                          isScrollingRef.current = false;
                        }, 1000);
                        
                        const footer = document.getElementById("g3-footer");
                        const footerDistance = footer ? footer.getBoundingClientRect().top : Infinity;
                        
                        // If the footer is about to be visible or is partially visible, jump to bottom
                        if (footerDistance < window.innerHeight * 1.5) {
                          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
                        } else {
                          // Scroll down by 80vh
                          window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
                        }
                      } else {
                        setActiveHash("");
                        isScrollingRef.current = true;
                        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
                        scrollTimeoutRef.current = setTimeout(() => {
                          isScrollingRef.current = false;
                        }, 1000);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setOpen(false);
                      }
                    } else {
                      router.push("/");
                    }
                  }}
                  className={`relative z-10 flex items-center justify-center h-9 w-9 shrink-0 rounded-full transition-colors duration-300 ${
                    activeHash === "" ? "text-white dark:text-black" : "text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                  }`}
                  aria-label={!isFooterVisible ? "Scroll down" : "Back to top"}
                >
                  {activeHash === "" && (
                    <motion.div
                      layoutId="activeG3NavPill"
                      className="absolute inset-0 bg-black dark:bg-white rounded-full -z-10 shadow-sm"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  {!isFooterVisible ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronUp className="h-5 w-5" />
                  )}
                </button>

                <nav aria-label="Main" className="hidden items-center md:flex">
                  {LINKS.map((l) => {
                    const isActive = activeHash === l.href;
                    return (
                      <Link
                        key={l.href}
                        href={`/${l.href}`}
                        scroll={false}
                        aria-current={isActive ? "location" : undefined}
                        onClick={(e) => handleLinkClick(e, l.href)}
                        className={`relative z-10 rounded-full px-5 py-2 text-sm transition-colors duration-300 cursor-pointer ${
                          isActive
                            ? "text-white dark:text-black font-medium"
                            : "text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeG3NavPill"
                            className="absolute inset-0 bg-black dark:bg-white rounded-full -z-10 shadow-sm"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                        {l.label}
                      </Link>
                    );
                  })}
                </nav>
              </motion.div>
            </AnimatePresence>

        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full md:hidden"
          style={{ background: "var(--g3-ink)", color: "var(--g3-black)" }}
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>

        {/* Desktop keeps a direct CTA in the pill. */}
        <Link
          href="/#contact"
          scroll={false}
          onClick={(e) => handleLinkClick(e, "#contact")}
          className="hidden shrink-0 rounded-full px-5 py-2 text-sm font-semibold md:block cursor-pointer"
          style={{ background: "var(--g3-ink)", color: "var(--g3-black)" }}
        >
          Book a consultation
        </Link>
          </div>
        </GlassSurface>
        </div>
      </motion.header>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[42] bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* 75% Bottom Drawer overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-0 left-0 right-0 h-[75vh] z-[43] flex flex-col justify-start pt-12 px-8 md:hidden border-t border-black/10 dark:border-white/10 shadow-2xl rounded-t-3xl"
            style={{ background: "var(--g3-black)" }}
          >
            <nav aria-label="Main" className="flex flex-col gap-4">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={`/${l.href}`}
                    scroll={false}
                    onClick={(e) => handleLinkClick(e, l.href)}
                    className="block py-3 text-3xl font-semibold tracking-tight cursor-pointer text-left w-full"
                    style={{
                      fontFamily: "var(--g3-font-display)",
                      color:
                        activeHash === l.href
                          ? "var(--g3-ink)"
                          : "var(--g3-ink-faint)",
                    }}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
