"use client";

import { useEffect, useState } from "react";
import { HERO, SITE } from "@/content/site";
import { SmartLink } from "@/components/ui/SmartLink";
import { Arrow } from "@/components/ui/Arrow";

/**
 * The estimate bar that rises once the hero is behind you.
 *
 * A frosted shell with the buttons sitting INSIDE it, rather than a bar that is
 * itself a button. Borrowing the page through a blur is what makes it float
 * rather than sit stuck on; on a glass company's site it is the obvious
 * material.
 *
 * TWO THINGS HERE ARE NOT STYLE CHOICES:
 *
 *  1. THE REVEAL IS TRANSFORM + VISIBILITY, NEVER OPACITY. Opacity below 1
 *     makes an element a backdrop root, so fading this in would kill its blur
 *     for every frame of the fade and snap it on at the end. Same rule the
 *     header's mega menu is built on.
 *
 *  2. IT WATCHES THE HERO'S CTA ROW — #hero-cta — and nothing else.
 *
 *     The first version observed the whole hero with a -88% rootMargin, on
 *     the theory that this held it back until the hero was nearly gone. It
 *     does the opposite: shrinking the root to its bottom 12% means the hero
 *     stops intersecting as soon as its bottom edge clears that band, which
 *     on a 911px viewport is about 110px of scroll — the bar arrived while
 *     the hero's buttons were still fully on screen, and the geometry was
 *     confusing enough that it also misbehaved on the way back up.
 *
 *     Watching the buttons directly needs no margin and no tuning: the bar is
 *     shown exactly when they are not visible, which is the actual rule. It
 *     is correct at any viewport, on any phone, and stays correct if the hero
 *     is ever re-laid-out.
 *
 * Rounded here, unlike everything else on the page. A floating object reads as
 * floating partly because it does not share the page's geometry — the hard
 * corners belong to things that are part of the layout.
 */
export function FloatingBar() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // The hero's own CTA row, not the hero. See the note above.
    const trigger = document.getElementById("hero-cta");
    if (!trigger) return;
    const obs = new IntersectionObserver(([e]) => setShown(!e.isIntersecting), {
      threshold: 0,
    });
    obs.observe(trigger);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-40 -translate-x-1/2 transition-[transform,visibility] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        shown ? "visible translate-y-0" : "pointer-events-none invisible translate-y-6"
      }`}
    >
      <div className="flex items-center gap-2 rounded-full border border-[color:var(--navy)]/12 bg-white/55 p-2 shadow-[0_18px_50px_-20px_rgba(0,38,61,0.35)] backdrop-blur-2xl backdrop-saturate-150">
        {/* The line of reassurance, not a control — hidden where the bar would
            otherwise be wider than a phone. */}
        <p className="hidden items-center gap-2.5 pl-5 pr-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--navy)]/60 sm:flex">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[color:var(--brass)]" />
          Free measure &amp; quote
          <span className="text-[color:var(--navy)]/30">&mdash; no obligation</span>
        </p>

        <SmartLink
          href="#configurator"
          className="flex items-center gap-3 rounded-full bg-[color:var(--navy)] px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white transition-colors duration-500 hover:bg-[color:var(--navy-lift)]"
        >
          {HERO.cta}
          <Arrow />
        </SmartLink>

        <a
          href={SITE.phoneHref}
          className="rounded-full px-5 py-3.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--navy)] transition-colors duration-500 hover:bg-[color:var(--navy)]/5"
        >
          {SITE.phone}
        </a>
      </div>
    </div>
  );
}
