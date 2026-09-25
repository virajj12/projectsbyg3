"use client";

/**
 * Sticky bottom CTA bar (spec 6, non-negotiable): Call / WhatsApp / Enquiry,
 * always reachable and never covered by content.
 *
 * Hidden on the contact page itself — the form is already on screen there, and
 * a bar pointing at the thing you're looking at is just lost thumb space.
 * Pages add bottom padding via .g3-has-sticky-cta so it never overlaps content.
 */

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CalendarCheck } from "lucide-react";
import { useGlobalLoader } from "@/components/global-loader-provider";

export default function StickyMobileCTA() {
  const pathname = usePathname();
  const router = useRouter();
  const { loading } = useGlobalLoader();
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (loading) return;
    const footer = document.getElementById("g3-footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setIsHidden(entries[0].isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, [pathname, loading]);
  
  if (pathname === "/contact" || pathname.startsWith("/projects") || loading) return null;

  const item = "flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[11px] font-medium";

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[41] flex border-t md:hidden backdrop-blur-md transition-transform duration-300 ${isHidden ? 'translate-y-[100%]' : 'translate-y-0'}`}
      style={{
        backgroundColor: "color-mix(in srgb, var(--g3-black) 80%, transparent)",
        borderColor: "var(--g3-rule)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >


      <button
        onClick={() => {
          const contact = document.getElementById("contact");
          // The form only exists on the home page; from anywhere else, go there.
          if (contact) contact.scrollIntoView({ behavior: "smooth" });
          else router.push("/#contact");
        }}
        className={`${item} transition-colors hover:opacity-70`}
        style={{ color: "var(--g3-ink)" }}
      >
        <CalendarCheck className="h-5 w-5" aria-hidden="true" />
        Enquire
      </button>
    </div>
  );
}
