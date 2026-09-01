import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { PlaneCursor } from "@/components/cursor/PlaneCursor";
import { JsonLd } from "@/components/ui/Primitives";
import { BASE_URL, organizationSchema, websiteSchema } from "@/lib/seo";

/**
 * Display serif for headlines, geometric sans for everything else. Both are
 * variable fonts loaded with `display: swap`, so text is readable on first
 * paint and the swap never shifts layout enough to register as CLS.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${site.name} — Personalised journeys, designed around you`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: site.founder ? [{ name: site.founder.name }] : undefined,
  creator: site.legalName,
  publisher: site.legalName,
  formatDetection: { telephone: true, address: false, email: true },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    url: BASE_URL,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  icons: { icon: [{ url: "/brand/favicon.svg", type: "image/svg+xml" }] },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#100f0e" },
    { media: "(prefers-color-scheme: dark)", color: "#100f0e" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${fraunces.variable} ${manrope.variable}`}>
      {/*
        Browser extensions write their own attributes onto <body> before React
        hydrates — ColorZilla's `cz-shortcut-listen`, and password managers,
        translators and dark-mode add-ons all do the same. The server never
        rendered them, so React reports a hydration mismatch for something no
        change to this codebase can prevent.

        `suppressHydrationWarning` applies to this element only, not to its
        subtree, so it silences exactly those injected attributes and a real
        mismatch anywhere inside the app still surfaces. That scoping is the
        point: left unsuppressed, the extension noise is what buries a genuine
        hydration error when we cause one.
      */}
      <body suppressHydrationWarning>
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />

        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <SmoothScroll />
        <PlaneCursor />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
