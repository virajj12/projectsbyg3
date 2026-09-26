import type { Metadata, Viewport } from "next";
import { Inter, Outfit, JetBrains_Mono, Oswald } from "next/font/google";
import "./globals.css";
import "./g3-theme.css";
import "wanted-sans/fonts/webfonts/variable/split/WantedSansVariable.css";

import { ThemeProvider } from "@/components/theme-provider";
import GlobalLoaderProvider from "@/components/global-loader-provider";

import G3Nav from "@/components/g3/G3Nav";
import G3Footer from "@/components/g3/G3Footer";
import StickyMobileCTA from "@/components/g3/StickyMobileCTA";
import SmoothScroll from "@/components/g3/SmoothScroll";
import servicesData from "@/content/services.json";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  EMAIL,
  INSTAGRAM_URL,
  DEFAULT_SHARE_IMAGE,
  ORGANIZATION_ID,
  WEBSITE_ID,
  absoluteUrl,
  jsonLd,
} from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Visible text is almost all Wanted Sans (g3-theme.css). Of the next/font
// families only Inter is needed at first paint (loader, body fallback), so the
// others load when used instead of competing with it as preloads.
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
  preload: false,
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  // Explicit, so no page can end up noindexed by accident. Large image
  // previews let Google show project photography at full width.
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  // Icons come from app/icon.png and app/apple-icon.png (file conventions).
  // public/favicon.svg is 750 KB of embedded bitmap, so it is no longer linked.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [{ url: DEFAULT_SHARE_IMAGE.url, alt: DEFAULT_SHARE_IMAGE.alt }],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfc" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

/**
 * Site-wide structured data: the business and the website, linked by @id so
 * pages can reference them. Every value is published on the site: the name,
 * Moodbidri / coastal Karnataka (footer), email and hours (contact section),
 * the two services (services section) and the Instagram account (socials
 * menu). No street address, phone, price or rating is claimed, because the
 * site does not publish one.
 */
const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "GeneralContractor",
      "@id": ORGANIZATION_ID,
      name: SITE_NAME,
      url: absoluteUrl("/"),
      logo: absoluteUrl("/icon.png"),
      image: absoluteUrl(DEFAULT_SHARE_IMAGE.url),
      description: SITE_DESCRIPTION,
      email: EMAIL,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Moodbidri",
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
      areaServed: { "@type": "Place", name: "Coastal Karnataka" },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:30",
        closes: "18:30",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: (servicesData as { title: string; body: string | null }[]).map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.title, description: s.body || undefined },
        })),
      },
      sameAs: [INSTAGRAM_URL],
      parentOrganization: { "@type": "Organization", name: "VerspeKtive" },
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: absoluteUrl("/"),
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en-IN",
      publisher: { "@id": ORGANIZATION_ID },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} ${oswald.variable} antialiased min-h-screen w-full h-full bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          <GlobalLoaderProvider>
            <SmoothScroll>
              <div className={`g3-theme g3-grain relative w-full overflow-x-clip ${jetbrains.variable}`}>
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{ __html: jsonLd(STRUCTURED_DATA) }}
                />
                <div className="relative w-full h-full flex flex-col min-h-screen pb-24 md:pb-10">
                  <main className="pb-20 md:pb-0 flex-grow">{children}</main>
                  <G3Nav />
                </div>
                <G3Footer />
                <StickyMobileCTA />
              </div>
            </SmoothScroll>
          </GlobalLoaderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
