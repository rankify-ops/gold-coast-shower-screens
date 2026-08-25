"use client";

import { useEffect, useState } from "react";
import { SmartLink } from "@/components/ui/SmartLink";
import { HERO, SITE } from "@/content/site";
import { Arrow } from "@/components/ui/Arrow";

/**
 * Estimate CTA that rises once the hero is behind you.
 *
 * A frosted shell with the buttons sitting *inside* it, rather than a bar that
 * is itself the buttons. The earlier version was a hard navy slab, and it read
 * as stuck onto the page rather than floating above it — nothing about it
 * acknowledged what it was covering. Borrowing the page behind it through a
 * blur is what makes it sit naturally, and on a glass company's site frosted
 * glass is the obvious material to reach for.
 *
 * Square-edged on purpose. Rankify's equivalent is a full pill, but every
 * other surface here — cards, buttons, spec rows, the artboard — is hard-
 * cornered, and a lone rounded element would read as borrowed from another
 * site.
 *
 * Two observers rather than a scroll offset: one on the hero, one on the
 * contact footer. A pixel threshold would need retuning every time the hero
 * changes height and would be wrong again on a phone; watching the elements
 * themselves is correct at any viewport.
 */
export function FloatingCta() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const contact = document.getElementById("contact");
    if (!hero) return;

    let heroGone = false;
    let atContact = false;
    const sync = () => setShown(heroGone && !atContact);

    const heroObs = new IntersectionObserver(
      ([e]) => {
        heroGone = !e.isIntersecting;
        sync();
      },
      // Fires once the hero is all but gone, so the bar never appears while the
      // hero's own buttons are still on screen — it hands over from them rather
      // than competing with them.
      { threshold: 0, rootMargin: "-88% 0px 0px 0px" }
    );
    heroObs.observe(hero);

    const contactObs = contact
      ? new IntersectionObserver(
          ([e]) => {
            atContact = e.isIntersecting;
            sync();
          },
          { threshold: 0.12 }
        )
      : null;
    contactObs?.observe(contact!);

    return () => {
      heroObs.disconnect();
      contactObs?.disconnect();
    };
  }, []);

  return (
    // pointer-events-none on the full-width track, re-enabled on the shell:
    // the track is invisible but spans the viewport, and would otherwise eat
    // clicks on anything scrolling underneath it.
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:pb-6 ${
        shown ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      aria-hidden={!shown}
    >
      <div
        className={`flex w-full max-w-[680px] items-center gap-3 border border-white/60 bg-white/55 p-2 text-ink shadow-[0_18px_50px_-10px_rgba(0,38,62,0.28)] backdrop-blur-2xl backdrop-saturate-150 sm:gap-5 sm:pl-6 ${
          shown ? "pointer-events-auto" : ""
        }`}
      >
        {/* Live dot — the ring expands and fades while the core stays put. */}
        <span className="relative hidden h-2 w-2 flex-none items-center justify-center sm:flex">
          <span className="cta-ping absolute inline-flex h-full w-full rounded-full bg-navy" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-navy" />
        </span>

        {/* whitespace-nowrap: at 660px the longer phrasing wrapped to two
            lines and knocked the dot and buttons out of vertical centre. */}
        <p className="mi hidden min-w-0 flex-1 whitespace-nowrap leading-tight sm:block">
          Free measure &amp; quote
          <span className="text-[color:var(--ink-38)]"> &mdash; no obligation</span>
        </p>

        {/* Buttons split the shell on a phone; on desktop they shrink back to
            their own width so the copy has room. */}
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none">
          <SmartLink
            href="#configurator"
            tabIndex={shown ? undefined : -1}
            className="mi group flex flex-1 items-center justify-center gap-2.5 whitespace-nowrap bg-navy px-5 py-3 text-white transition-colors duration-500 hover:bg-[color:var(--navy-lift)] sm:flex-none"
          >
            {HERO.cta}
            <span
              aria-hidden
              className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
            >
              <Arrow />
            </span>
          </SmartLink>

          <a
            href={SITE.phoneHref}
            tabIndex={shown ? undefined : -1}
            className="mi flex flex-1 items-center justify-center whitespace-nowrap border border-[color:var(--rule-dark)] bg-white/60 px-5 py-3 transition-colors duration-500 hover:bg-white sm:flex-none"
          >
            {SITE.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
