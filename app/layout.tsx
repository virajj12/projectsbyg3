import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./g3-theme.css";
import "wanted-sans/fonts/webfonts/variable/split/WantedSansVariable.css";

import { ThemeProvider } from "@/components/theme-provider";
import GlobalLoaderProvider from "@/components/global-loader-provider";

import G3Nav from "@/components/g3/G3Nav";
import G3Footer from "@/components/g3/G3Footer";
import StickyMobileCTA from "@/components/g3/StickyMobileCTA";
import SmoothScroll from "@/components/g3/SmoothScroll";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
});

export const metadata: Metadata = {
  title: {
    default: "G3 Builders & Architects",
    template: "%s · G3 Builders & Architects",
  },
  description:
    "Exterior design consultancy, interior planning and execution delivered end to end. Residential and commercial projects across coastal Karnataka.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "G3 Builders & Architects",
    description: "Exterior design consultancy, interior planning and execution delivered end to end.",
    type: "website",
  },
};

const LOCAL_BUSINESS = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  name: "G3 Builders & Architects",
  description: "Exterior design consultancy, interior planning and execution delivered end to end.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Moodbidri",
    addressRegion: "Karnataka",
    addressCountry: "IN",
  },
  email: "verspektive@gmail.com",
  parentOrganization: { "@type": "Organization", name: "VerspeKtive" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} antialiased min-h-screen w-full h-full bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <GlobalLoaderProvider>
            <SmoothScroll>
              <div className={`g3-theme g3-grain relative w-full overflow-x-clip ${jetbrains.variable}`}>
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS) }}
                />
                <G3Nav />
                <main className="pb-20 md:pb-0">{children}</main>
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
