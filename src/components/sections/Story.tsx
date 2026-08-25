"use client";

import { STORY } from "@/content/site";

/**
 * Their four "about" blocks, as a stack that deals itself.
 *
 * On their site these are four separate full-width panels making broadly the
 * same claim four times, one after another — the single most repetitive stretch
 * of the page. Stacking them fixes that: each card sticks where the last one
 * stopped and the next slides up over it, so the four are read as one
 * accumulating argument rather than four restatements, and the whole run costs
 * about the height of two.
 *
 * Pure CSS. `position: sticky` with a top offset that steps down per card is
 * the entire mechanic — no scroll listener, no measurement, nothing to fall out
 * of sync on resize. The offset step is what leaves the previous card's top
 * edge peeking out, so you can see the pile building.
 */
export function Story() {
  return (
    <section id="story" className="relative bg-mist">
      <div className="layer px-6 pt-24 lg:px-12 lg:pt-32">
        <p className="mi text-[color:var(--ink-38)]">(05) &mdash; Who we are</p>
        <h2 className="dsp-sm mt-8 max-w-[18ch] text-[clamp(28px,3.6vw,54px)]">
          Four reasons this keeps working.
        </h2>
      </div>

      {/* pb leaves room for the stack to finish before the next section. */}
      <div className="layer px-6 pb-32 pt-16 lg:px-12">
        {STORY.map((block, i) => (
          <article
            key={block.index}
            className="sticky"
            style={{
              // Each card parks 18px lower than the one before, so the stack
              // fans out and every card in it stays identifiable.
              top: `calc(7rem + ${i * 16}px)`,
              // Later cards paint over earlier ones.
              zIndex: i + 1,
              // Not the last card's job to leave a gap.
              marginBottom: i === STORY.length - 1 ? 0 : "2.5rem",
            }}
          >
            {/*
                Two columns, and a floor under the card.

                Stacked one-column cards clipped their own body copy: a taller
                card's last lines sat exactly where the next card parks, so a
                paragraph ended mid-sentence behind an edge. Splitting title
                from body halves the height, and the min-height gives every
                card the same floor so the overlap always lands on empty space
                rather than on a line of text.
            */}
            <div className="grid min-h-[clamp(280px,34svh,380px)] items-start gap-x-16 gap-y-6 border border-[color:var(--rule-dark)] bg-paper px-7 py-10 shadow-[0_20px_50px_-30px_rgba(0,38,62,0.35)] sm:px-12 sm:py-14 lg:grid-cols-[1fr_1fr]">
              <div className="flex gap-8">
                <span className="mi flex-none pt-2 text-[color:var(--ink-38)]">{block.index}</span>
                <h3 className="dsp-sm-sentence max-w-[16ch] text-[clamp(22px,2.6vw,40px)]">
                  {block.title}
                </h3>
              </div>

              <p className="bd-sentence max-w-[52ch] text-[color:var(--ink-60)] lg:pt-2">
                {block.body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
