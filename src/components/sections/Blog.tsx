"use client";

import { useState } from "react";
import { BLOG } from "@/content/site";
import { Arrow } from "@/components/ui/Arrow";

/**
 * Their nine most recent articles.
 *
 * A list, not a card grid. Nine cards would need nine images they have not
 * given us and would take more room than a blog deserves on a home page; a
 * ruled list reads faster and the hover state does the work a thumbnail
 * usually would — the hovered row lifts to full ink, everything else drops
 * back, so the eye is only ever holding one title at a time.
 *
 * Titles and dates are theirs, exactly as published. No excerpts: they publish
 * none, and inventing them would put words in their mouth.
 */
export function Blog() {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <section id="blog" className="relative bg-paper">
      <div className="layer px-6 py-24 lg:px-12 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="mi text-[color:var(--ink-38)]">(08) &mdash; Journal</p>
            <h2 className="dsp-sm mt-8 max-w-[16ch] text-[clamp(28px,3.6vw,54px)]">
              Answers, written down.
            </h2>
          </div>
          <p className="bd-sentence max-w-[34ch] text-[color:var(--ink-60)]">
            The questions we get asked on site, covered properly.
          </p>
        </div>

        <ol
          className="mt-16 border-t border-[color:var(--rule-dark)]"
          onMouseLeave={() => setHover(null)}
        >
          {BLOG.map((post, i) => {
            // Dim every row except the hovered one — but only once something
            // is actually hovered, so the list sits at full strength at rest.
            const dim = hover !== null && hover !== i;
            return (
              <li key={post.title} className="border-b border-[color:var(--rule-dark)]">
                <a
                  href="#blog"
                  onMouseEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  className="group flex items-center gap-6 py-6 transition-opacity duration-500 lg:gap-12"
                  style={{ opacity: dim ? 0.32 : 1 }}
                >
                  <span className="mi w-8 flex-none text-[color:var(--ink-38)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className="dsp-sm-sentence flex-1 text-[clamp(16px,1.7vw,25px)]">
                    {post.title}
                  </span>

                  <span className="mi hidden flex-none text-[color:var(--ink-38)] sm:block">
                    {post.date}
                  </span>

                  <span className="flex h-8 w-8 flex-none items-center justify-center border border-[color:var(--rule-dark)] text-ink transition-colors duration-300 group-hover:border-brass group-hover:bg-brass group-hover:text-black">
                    <Arrow />
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
