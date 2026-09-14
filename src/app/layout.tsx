import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Inter, Zalando_Sans } from "next/font/google";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { EstimatorProvider } from "@/components/estimator/EstimatorProvider";
import { PreviewGate } from "@/components/layout/PreviewGate";
import { PREVIEW_ENABLED, PREVIEW_ENDS } from "@/content/preview";
import "./globals.css";

// One typeface doing every job — display, body and micro-type are all Geist at
// different sizes. 500 and 600 only; there is no bold on this page.
const geist = Geist({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-geist",
  display: "swap",
});

/*
 * Inter, for /split-3 only.
 *
 * Measured off rankify.com.au/shopify-development-services, which is the type
 * system that build is meant to sit in: Inter at 400 and 500, and nothing
 * heavier. The earlier objection to Inter was to it being set at 650 — at 500
 * it is the restrained face that page actually uses.
 */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

/*
 * /refresh runs its own pair, both measured off hanza-template.framer.website:
 * Zalando Sans at 500 for display — uppercase, 0.9 line-height, huge — and
 * Geist Mono at 500 for every label, number and caption. The split between a
 * wide display face and a monospaced micro face is most of that template's
 * character; matching the sizes without matching that split would miss it.
 */
const zalando = Zalando_Sans({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-zalando",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

/*
 * The display serif for /hero-glass. The reference sets its headline in a
 * transitional serif with fine hairlines — the one thing that stops a
 * near-monochrome product shot reading as a tech page rather than as a
 * bathroom brand. Instrument Serif is that letterform, and it only ever
 * appears at display size.
 */
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gold Coast Shower Screens — Made to Measure Glass",
  description:
    "Frameless, semi-frameless and framed shower screens, splashbacks, mirrors and wardrobe doors. Made to measure at our Gold Coast factory and installed by the people who made them.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-AU"
      className={`${geist.variable} ${inter.variable} ${zalando.variable} ${geistMono.variable} ${serif.variable}`}
      suppressHydrationWarning
    >
      <head>
        {PREVIEW_ENABLED && (
          <script
            // Runs before first paint so an ended preview is blurred from the
            // very first frame, not after React loads. Static, author-controlled.
            dangerouslySetInnerHTML={{
              __html: `try{if(Date.now()>=${Date.parse(PREVIEW_ENDS)}||new URLSearchParams(location.search).get("preview")==="expired")document.documentElement.classList.add("preview-expired")}catch(e){}`,
            }}
          />
        )}
      </head>
      {/* .grain paints one fixed noise plane over the whole viewport. */}
      <body className="grain">
        <PreviewGate />
        <SmoothScroll />
        {/* Wraps the page so every "#configurator" CTA opens the estimator
            modal instead of jumping. */}
        <EstimatorProvider>{children}</EstimatorProvider>
        {/* Lives in the layout rather than each page so the three hero-grade
            routes all get it without duplication. It targets #top and #contact
            by id, both of which every page renders. */}
      </body>
    </html>
  );
}
