import { FlutedGlass } from "@/components/glass/FlutedGlass";
import { FrostHeader } from "@/components/glass/FrostHeader";
import { LogoRail } from "@/components/glass/LogoRail";
import { IntroSection } from "@/components/glass/IntroSection";
import { ProductsSection } from "@/components/glass/ProductsSection";
import { GallerySection } from "@/components/glass/GallerySection";
import { ReviewsSection } from "@/components/glass/ReviewsSection";
import { WhySection } from "@/components/glass/WhySection";
import Image from "next/image";
import { HERO, PROOF, RATING, SITE } from "@/content/site";
import { asset } from "@/lib/basePath";
import { SmartLink } from "@/components/ui/SmartLink";
import { Arrow } from "@/components/ui/Arrow";
import { Stars } from "@/components/ui/Stars";
import { LottieIcon } from "@/components/glass/LottieIcon";

/*
 * /hero-glass — fluted glass hero. Hero only.
 *
 * Built to the reference: a studio product shot of a chrome rain head on a
 * seamless wall, with a sheet of fine reeded glass over the right half and the
 * type on the plain left.
 *
 * Three things carry it, in order of importance:
 *
 *   1. The refraction is RENDERED. See FlutedGlass — CSS cannot refract, only
 *      blur, and a striped overlay always looks painted on.
 *   2. The flutes are FINE. 20px, not 40. The narrow reed is what turns the
 *      horizontal shower arm into a sawtooth where it crosses the sheet, which
 *      is the single most recognisable thing in the reference.
 *   3. The type is a clean sans at 500 against letterspaced micro-type. No
 *      serif and no bold anywhere — on a plate this restrained, weight is the
 *      thing that would cheapen it.
 *
 * Everything is their own: their photograph, their phone number, their
 * categories. Only the layout is borrowed.
 */
export const metadata = {
  title: "Gold Coast Shower Screens — Fluted Glass Hero",
  robots: { index: false, follow: false },
};

const NAV = ["Shower Screens", "Splashbacks", "Mirrors", "Wardrobe Doors"];

export default function HeroGlass() {
  return (
    <>
    <main
      id="top"
      className="relative flex min-h-svh flex-col overflow-hidden"
      // Inline, not a utility: the .hz rules that follow Tailwind's layer in
      // globals.css win the specificity tie against bg-/text- classes.
      //
      // The ground is sampled from the plate's own wall (#f0eeed) rather than
      // set to the brand mid grey. Matching the photograph to a colour is what
      // blew its highlights last time; matching the page to the photograph
      // costs nothing. The section below sits a shade lighter at #f5f5f5, so
      // the tonal move happens between sections instead of inside one.
      style={{ background: "#f0eeed", color: "var(--navy)" }}
    >
      {/* ── The plate ────────────────────────────────────────────────────
          A fixed sheet of reeded glass over the right of the frame, using the
          fluted transform from franky-adl/fractal-glass-gradients. */}
      <div className="absolute inset-0">
        <FlutedGlass
          src={asset("/img/showerhead-light.webp")}
          from={0.5}
          fluteWidth={26}
          strength={22}
          tone="light"
          className="h-full w-full"
        />
      </div>

      {/*
          NO WASH.

          There was a gradient scrim here lifting the left third so type could
          sit over the shower arm's wall flange. It is gone: the flange coming
          cleanly out of the wall is the best thing in this photograph, and
          veiling it to buy space for a headline was the wrong trade.

          What makes that affordable is the headline below being short. The
          flange's dark pixels begin at x=618 of 1905; the two lines here stop
          well before it. Anything longer in the h1 will run into the hardware
          again — the subhead underneath is the place for length.
      */}

      <FrostHeader />

      {/* ── Content ── */}
      {/*
          The header is `fixed`, so it is out of flow and this band starts at
          y=0 — padding the top by the header's own height re-centres the
          column in the space actually left over.
      */}
      <div className="relative z-10 flex flex-1 items-center px-8 pt-[84px] lg:px-14">
        {/*
            820, not 600. The glass edge is at 50% — 960px at this width — so
            there is room for the four ranges to sit on one line instead of
            wrapping "Wardrobe Doors" onto its own. Widening the column only
            affects that row: the headline breaks on its own <br />, the body
            is capped at 44ch, and everything else is short.
        */}
        <div className="max-w-[820px]">
          {/* Rating, at the top where it qualifies everything under it.

              The margins down this column are tuned to OPTICAL gaps — ink to
              ink — not to the boxes. A 62px headline's line box carries about
              12px of leading above the cap height and 15px below the baseline,
              so equal margins produce visibly unequal spacing: the rating used
              to read as the loosest join on the page while carrying one of the
              smallest margins. */}
          <SmartLink href="#reviews" className="group inline-flex items-center gap-3">
            <Stars
              size={14}
              label={`Rated ${RATING.score} out of 5`}
              className="text-[color:var(--gold)]"
            />
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--navy)]/60">
              <span className="text-[color:var(--navy)]">{RATING.score}</span>
              <span className="mx-2">/</span>
              {RATING.count}+ reviews on {RATING.source}
            </span>
          </SmartLink>

          {/* Their own headline and paragraph, straight from HERO — this page
              had invented lines sitting here, which is exactly the thing that
              must never ship. */}
          <h1
            className="mt-5 text-[clamp(38px,4.6vw,68px)] font-medium leading-[1.02] tracking-[-0.035em] text-[color:var(--navy)]"
            style={{ fontFamily: "var(--font-geist), ui-sans-serif, system-ui, sans-serif" }}
          >
            {HERO.display[0]}
            <br />
            {HERO.display[1]}
          </h1>

          {/* Their own line, as a subhead under the headline. Deliberately
              restrained — pushed to 26px at full navy it started competing
              with the h1 rather than supporting it. */}
          <p
            className="mt-5 max-w-[52ch] text-[clamp(17px,1.2vw,21px)] font-medium leading-[1.35] tracking-[-0.02em] text-[color:var(--navy)]/85"
            style={{ fontFamily: "var(--font-geist), ui-sans-serif, system-ui, sans-serif" }}
          >
            {HERO.headline} {HERO.headlineDim}
          </p>

          {/*
              52ch. This was widened to 660px once, on the argument that every
              row but the headline had 300-500px of clean wall going unused.
              The measurement was right and the result was worse: filling the
              space made the column heavy and lost the air that carries this
              hero. A narrow measure against a wide photograph is the point,
              not an oversight.
          */}
          <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.65] text-[color:var(--navy)]/70">
            {HERO.body}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <SmartLink
              href="#configurator"
              className="group flex items-center gap-3 bg-[color:var(--navy)] px-8 py-4 text-[11px] font-medium uppercase tracking-[0.14em] text-white transition-colors duration-500 hover:bg-[color:var(--navy-lift)]"
            >
              {HERO.cta}
              <Arrow />
            </SmartLink>

            <a
              href={SITE.phoneHref}
              className="flex items-center gap-3 border border-[color:var(--navy)]/25 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--navy)] transition-colors duration-500 hover:border-[color:var(--navy)] hover:bg-[color:var(--navy)]/5"
            >
              <span
                aria-hidden
                className="h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-current"
              />
              {SITE.phone}
            </a>
          </div>

          {/* The four ranges as a line of links, not blocks.

              Blocks were tried here and they read as heavier than the CTAs
              they sit under — four filled cards competing with the one button
              that matters. A line of icon-and-label keeps the weight where it
              belongs and lets the column stay narrow, which is what makes this
              hero feel calm rather than packed.

              The column is wide enough (820px cap) that all four sit on ONE
              line; wrapping "Wardrobe Doors" onto its own row is what this
              layout looked like when it was too narrow, and it looked broken.
          */}
          <nav className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-[color:var(--navy)]/12 pt-6">
            {HERO.categories.map((c) => (
              <SmartLink
                key={c.label}
                href="#products"
                className="group flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--navy)]/65 transition-colors duration-500 hover:text-[color:var(--navy)]"
              >
                {/* Their own category SVG, painted by CSS mask so it takes the
                    link's colour and the file itself stays untouched. */}
                <span
                  aria-hidden
                  style={{
                    maskImage: `url(${asset(c.icon)})`,
                    WebkitMaskImage: `url(${asset(c.icon)})`,
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                  }}
                  className="h-5 w-5 flex-none bg-current transition-transform duration-500 group-hover:scale-110"
                />
                {c.label}
              </SmartLink>
            ))}
          </nav>

          {/* Warranty and volume — their own badge, their own figures.

              STATED, NOT COUNTED. The count-up is kept for the sections below,
              where it fires as you scroll into them. In the hero it has
              nowhere to arrive from: it is on screen at load, so it either
              spins immediately and reads as a loading state, or sits at zero
              until it happens to be looked at. The figures are also taken from
              PROOF rather than retyped, so the hero and the stat band below it
              cannot drift apart. */}
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4">
            <Image
              src={asset("/img/badges/3-Year-Warranty-Blue-BG.webp")}
              alt="Three year warranty"
              width={591}
              height={257}
              className="h-11 w-auto"
            />
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--navy)]/60">
              <span className="text-[color:var(--navy)]">{PROOF[0].figure}</span>{" "}
              clients
              <span className="mx-3 text-[color:var(--navy)]/30">/</span>
              <span className="text-[color:var(--navy)]">{PROOF[1].figure}</span>{" "}
              screens
            </p>

            {/* Australian owned and operated — their own claim, taken from
                WHY 05. The kangaroo is the same Lottie as that card uses, at
                badge size, and loops with the rest of them. */}
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em]">
              <LottieIcon src="/lottie/australian-made.json" size={30} />
              <span className="text-[color:var(--navy)]">Australian</span>
              <span className="text-[color:var(--navy)]/60">owned and operated</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Foot ──────────────────────────────────────────────────────────
          The "01 / 03" counter that used to sit here is gone. It was lifted
          from the reference layout, where it drives a real three-slide hero;
          here it advertised a second and third slide that do not exist. On a
          page selling precision, a control that does nothing is a poor thing
          to leave lying around.

          What remains is true and worth stating: their licence number and
          their quoted lead time.
      */}
      <div className="relative z-10 flex items-end justify-end px-8 pb-7 lg:px-14">
        <p className="hidden text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--navy)]/45 sm:block">
          {SITE.licence}
          <span className="mx-3">—</span>
          Measure to install / 14 working days
        </p>
      </div>

    </main>

    <LogoRail />
    <IntroSection />
    <ProductsSection />
    <GallerySection />
    <ReviewsSection />
    <WhySection />
    </>
  );
}
