import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Site-wide 404. Served with a real 404 status (so it is never indexed as a
 * soft 404), and gives the visitor, and a crawler that followed a stale
 * link, a way back into the site instead of a dead end.
 */
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[var(--g3-black)] px-6 pt-32 pb-24 text-center">
      <p className="g3-meta mb-4">404</p>
      <h1 className="g3-display-xl max-w-2xl" style={{ color: "var(--g3-ink)" }}>
        This page doesn&rsquo;t exist.
      </h1>
      <p className="g3-body mt-6 max-w-xl">
        The link may be old, or the address mistyped. Our work and the enquiry form are a click away.
      </p>
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
        <Link href="/" className="g3-link">
          Go to the home page <ChevronRight aria-hidden="true" />
        </Link>
        <Link href="/projects" className="g3-link">
          See our projects <ChevronRight aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
