"use client";

/**
 * Sticky bottom CTA bar (spec 6, non-negotiable): Call / WhatsApp / Enquiry,
 * always reachable and never covered by content.
 *
 * Hidden on the contact page itself — the form is already on screen there, and
 * a bar pointing at the thing you're looking at is just lost thumb space.
 * Pages add bottom padding via .g3-has-sticky-cta so it never overlaps content.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MessageCircle, CalendarCheck } from "lucide-react";
import { useGlobalLoader } from "@/components/global-loader-provider";

const PHONE = "+919880000000";
const WHATSAPP = "919880000000";

export default function StickyMobileCTA() {
  const pathname = usePathname();
  const { loading } = useGlobalLoader();
  
  if (pathname === "/contact" || loading) return null;

  const item = "flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[11px] font-medium";

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[41] flex border-t md:hidden bg-white/80 dark:bg-black/80 backdrop-blur-md border-black/10 dark:border-white/10"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <a href={`tel:${PHONE}`} className={`${item} text-muted-foreground hover:text-foreground transition-colors duration-300`}>
        <Phone className="h-5 w-5" aria-hidden="true" />
        Call
      </a>
      <a
        href={`https://wa.me/${WHATSAPP}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${item} text-muted-foreground hover:text-foreground transition-colors duration-300`}
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        WhatsApp
      </a>
      <Link
        href="/contact"
        className={`${item} bg-black text-white dark:bg-white dark:text-black`}
      >
        <CalendarCheck className="h-5 w-5" aria-hidden="true" />
        Enquire
      </Link>
    </div>
  );
}
