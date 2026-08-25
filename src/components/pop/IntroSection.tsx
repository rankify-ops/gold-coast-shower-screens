"use client";

import Image from "next/image";
import { INTRO, PROOF } from "@/content/site";
import { asset } from "@/lib/basePath";
import { Counter } from "@/components/ui/Counter";

/**
 * (01) — Who we are. Ported from the /split build, restyled for this page.
 *
 * The layout is what made it work there and it is kept exactly: the two halves
 * are OFFSET rather than aligned. The heading lands right and high, the
 * supporting line sits low on the left, so the eye crosses the split diagonally
 * instead of reading two stacked paragraphs. That offset is the whole reason a
 * full-width two-column slab does not read as a slide.
 *
 * Their three headline figures close the section, so the positioning claim and
 * the evidence for it arrive together — on their own site these are four
 * screens of scrolling apart.
 *
 * WHAT CHANGED COMING ACROSS: /split set this in uppercase on its dark palette.
 * Here it is sentence case in Geist at weight 500 on the hero's own #f0eeed,
 * with navy ink and 11px micro-type at 0.14em — the same system as the hero
 * above it. Uppercase at 62px on a light ground shouts in a way nothing else
 * on this page does.
 */
export function IntroSection() {
  return (
    <section
      id="about"
      // .on-navy re-points --ink / --ink-2 / --ink-3 / --rule to their light
      // equivalents, so every child inverts without being told it is on a dark
      // ground. This section is the page's only tonal break and it is the whole
      // reason the light ones around it read as bright.
      className="on-navy relative"
      style={{ background: "var(--navy)", color: "var(--ink)" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/*
            The left half is the photograph and nothing else.

            The copy used to sit on top of it. That never worked: white type
            needed a navy scrim heavy enough to turn a bright white bathroom
            into a dark blue panel, and once the scrim came off, navy type
            measured 2.26:1 against the shower recess behind it — well under
            the 4.5:1 floor. The plate is bright in some places and mid-tone in
            others, which is the one thing no single ink colour survives.

            With the text moved across, the picture needs no treatment at all
            and shows in its own colour. 1800x1012 into this column, so it is
            cropped rather than stretched.
        */}
        <div className="relative min-h-[320px] overflow-hidden border-b border-[color:var(--rule)] lg:min-h-0 lg:border-b-0">
          <Image
            src={asset("/img/hero-natural.webp")}
            alt="A frameless shower screen and fluted vanity in a finished bathroom"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Everything reads down the right. */}
        <div className="flex flex-col justify-center px-8 py-16 lg:border-l lg:border-[color:var(--rule)] lg:px-14 lg:py-20">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[color:var(--sky)]">
            (01) &mdash; Who we are
          </p>

          <h2
            className="mt-8 max-w-[16ch] text-[clamp(30px,3.8vw,58px)] font-medium leading-[1.04] tracking-[-0.035em]"
            style={{ fontFamily: "var(--font-geist), ui-sans-serif, system-ui, sans-serif" }}
          >
            Gold Coast&rsquo;s leading shower screen specialist.
          </h2>

          <p className="mt-8 max-w-[46ch] text-[16px] leading-[1.65] text-[color:var(--ink-2)]">
            {INTRO.body}
          </p>

          {/* Their summary line, ruled off so two paragraphs of similar weight
              do not read as one long block. */}
          <p className="mt-8 max-w-[46ch] border-t border-[color:var(--rule)] pt-8 text-[16px] leading-[1.65] text-[color:var(--ink-2)]">
            {INTRO.sub}
          </p>
        </div>
      </div>

      {/* Figures, full width, hairline-separated. gap-px over a hairline ground
          draws each divider once — two adjacent borders would double up. */}
      {/* The band steps back out to white while the section above it stays
          navy. .on-light restores the tiers — inside .on-navy these cells
          would otherwise inherit white ink on a white ground. The labels are
          --sky either way, so they carry across unchanged.

          text-[color:var(--ink)] is not redundant. The section sets `color:
          var(--ink)` as an inline style, which resolves to white AT THE
          SECTION and is then inherited as a plain computed colour — swapping
          the token further down does not re-run it. The figures came out white
          on white until this line re-resolved it here. */}
      <div className="on-light grid gap-px border-y border-[color:var(--rule)] bg-[color:var(--rule)] text-[color:var(--ink)] sm:grid-cols-3">
        {PROOF.map((stat) => (
          <div key={stat.label} className="bg-white px-8 py-12 lg:px-14">
            <p
              className="text-[clamp(34px,4.2vw,62px)] font-medium leading-none tracking-[-0.04em]"
              style={{ fontFamily: "var(--font-geist), ui-sans-serif, system-ui, sans-serif" }}
            >
              <Counter to={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--sky)]">
              {stat.label}
            </p>
            <p className="mt-4 max-w-[34ch] text-[16px] leading-[1.65] text-[color:var(--ink-2)]">
              {stat.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
