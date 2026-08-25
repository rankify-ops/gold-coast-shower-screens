"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SmartLink } from "@/components/ui/SmartLink";
import { MEGA_PRODUCTS, NAV, SITE } from "@/content/site";
import { asset } from "@/lib/basePath";
import { Arrow } from "@/components/ui/Arrow";

/**
 * Transparent over the hero, then a hairline bar with a blur behind it.
 * Nav items are separated by slashes rather than spacing alone, which keeps
 * the whole row reading as one instrument label.
 */
export function Header({ light = false }: { light?: boolean }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  // The products mega menu.
  //
  // Closing is deferred rather than immediate. The panel hangs below the
  // header, so travelling from the Products link down into it crosses the
  // header's own bottom padding — with an immediate close, that gap shut the
  // menu before the pointer ever arrived. A short grace period covers the
  // crossing, and re-entering either the nav or the panel cancels it.
  const [mega, setMega] = useState(false);
  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMega = useCallback(() => {
    if (megaTimer.current) clearTimeout(megaTimer.current);
    setMega(true);
  }, []);

  const closeMega = useCallback((delay = 180) => {
    if (megaTimer.current) clearTimeout(megaTimer.current);
    megaTimer.current = setTimeout(() => setMega(false), delay);
  }, []);

  useEffect(() => () => {
    if (megaTimer.current) clearTimeout(megaTimer.current);
  }, []);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setSolid(window.scrollY > 60);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      // hero-scope, not on-dark: the header is a sibling of the hero rather
      // than a child, so it needs the beige treatment declared on it directly
      // or its solid button would resolve to the body's navy.
      //
      // `light` now means light for the whole page, not just over the hero.
      // It used to hand back to hero-scope the moment the bar went solid,
      // which turned a light-themed page's header black the instant you
      // scrolled — the one element guaranteed to be on screen at all times.
      // The solid state is a grey frosted plate instead, so the scope never
      // has to change and the logo never has to swap.
      onMouseLeave={() => closeMega(0)}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        light ? "hero-light" : "hero-scope"
      }`}
    >
      {/*
          The frosted bar, as its own element rather than a background on the
          <header>.

          An element with backdrop-filter establishes a backdrop root, and
          anything inside it can only blur what is painted within that root.
          With the blur on the <header>, the mega menu — a descendant — had
          nothing left to sample the moment the bar went solid on scroll, so
          the menu frosted correctly at the top of the page and went flat
          everywhere below it. Moving the blur to a sibling of the menu leaves
          the header itself filter-free, so the menu blurs the page again.
      */}
      <div
        aria-hidden
        // The hairline stays on at rest either way — it reads as the top edge
        // of the page rather than something that appears once you move, and it
        // gives the mega menu a line to hang off.
        //
        // On a light theme the grey bar IS the bar, not a scrolled state of
        // it: a transparent header leaves the top of the page looking
        // unfinished and puts the nav on top of whatever happens to be behind
        // it. So it is frosted from the start, and scrolling only deepens the
        // tint enough to register that the page has moved. The dark builds
        // keep the original behaviour, where the transparent bar over a
        // full-bleed hero is the point.
        className={`absolute inset-0 border-b border-[color:var(--rule)] transition-colors duration-500 ${
          light
            ? solid
              ? "bg-[color:var(--mist)]/90 backdrop-blur-xl"
              : "bg-[color:var(--mist)]/70 backdrop-blur-xl"
            : solid
              ? "bg-black/70 backdrop-blur-xl"
              : ""
        }`}
      />

      <div className="relative flex items-center justify-between px-6 py-5 lg:px-12">
        <SmartLink href="#top" aria-label={SITE.name}>
            <Image
              // Their dark logo over the light hero; the white/taupe cut
              // everywhere else. Both are their own files, untouched.
              src={asset(
                light
                  ? "/img/logos/Gold-Coast-Screens-Logo-1.svg"
                  : "/img/logos/Gold-Coast-Screens-Logo-White-Taupe.svg"
              )}
              alt={SITE.name}
              width={200}
              height={39}
              priority
              className="h-[26px] w-auto lg:h-[30px]"
          />
        </SmartLink>

        <nav className="hidden items-center gap-5 lg:flex">
          {NAV.map((item, i) => {
            const isProducts = item.href === "#products";
            return (
              <span key={item.label} className="flex items-center gap-5">
                <SmartLink
                  href={item.href}
                  // Only Products opens the panel; every other item closes it,
                  // so sliding along the row does not leave it hanging open.
                  onMouseEnter={() => (isProducts ? openMega() : closeMega(0))}
                  onFocus={() => (isProducts ? openMega() : closeMega(0))}
                  aria-expanded={isProducts ? mega : undefined}
                  className={`ln text-[13px] font-semibold uppercase tracking-[var(--track-micro)] transition-colors duration-300 ${
                    isProducts && mega ? "text-brass" : "text-[color:var(--w-90)]"
                  }`}
                >
                  {item.label}
                </SmartLink>
                {i < NAV.length - 1 ? (
                  <span aria-hidden className="mi text-[color:var(--rule)]">
                    /
                  </span>
                ) : null}
              </span>
            );
          })}
        </nav>

        <div className="flex items-center gap-5">
          <a href={SITE.phoneHref} className="mi btn btn-solid hidden sm:inline-flex">
            {SITE.phone}
          </a>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-8 w-8 flex-col items-end justify-center gap-[6px] lg:hidden"
          >
            <span
              className={`h-px bg-[color:var(--w-90)] transition-all duration-500 ${
                open ? "w-6 translate-y-[3.5px] rotate-45" : "w-6"
              }`}
            />
            <span
              className={`h-px bg-[color:var(--w-90)] transition-all duration-500 ${
                open ? "w-6 -translate-y-[3.5px] -rotate-45" : "w-4"
              }`}
            />
          </button>
        </div>
      </div>

      {/*
          Products mega menu.

          Nothing on this wrapper may isolate the backdrop, and that rules out
          fading it in. Chrome forms a backdrop root from opacity < 1, filter,
          mask, mix-blend-mode and will-change of any of them, exactly as it
          does from backdrop-filter — so for every frame of an opacity fade the
          blurred grid inside has nothing to sample, and the frost only snaps
          on when the fade lands on 1. That was the flash.

          So the reveal is transform plus visibility, neither of which forms a
          backdrop root: the panel is opaque from the first frame and the frost
          is live the whole way in. visibility is transitioned rather than
          toggled so it stays painted while sliding out, then flips at the end
          of the duration instead of cutting on frame one.
          Full-bleed rather than a dropdown pinned under the link: four columns
          of variants need the width, and a narrow panel would either wrap the
          longer labels or run off the right edge on the last column.

          Kept mounted and faded so the columns do not reflow on every hover,
          and pointer-events follow visibility so it cannot swallow clicks on
          the hero while it is hidden.
      */}
      <div
        onMouseEnter={openMega}
        className={`absolute inset-x-0 top-full hidden transition-[transform,visibility] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] lg:block ${
          mega
            ? "pointer-events-auto visible translate-y-0"
            : "pointer-events-none invisible -translate-y-2"
        }`}
        aria-hidden={!mega}
      >
        {/*
            A cell grid rather than four loose lists.

            gap-px over a rule-coloured ground draws every divider as a single
            hairline that cannot double up where cells meet, and each row is
            split into a fixed icon cell and a flexible label cell so the
            icons line up down the whole column regardless of label length.

            The grid sits flush against the header bar — no top padding — so
            the two touch and it reads as hanging off the header rather than
            floating beneath it with a gap.

            No border around the outside, and no full-bleed bar behind it
            either — the grid itself is the only surface, floating on the hero.
            The blur and the drop shadow live on the grid rather than on a
            wrapper, so the panel is exactly the width of its own columns.

            The columns hold 4, 4, 5 and 3 items, so they end at different
            depths. Every row keeps its bottom rule, including the last, so a
            column that runs out early still closes with a line instead of
            trailing off into an open box.
        */}
        <div className="mx-auto max-w-[1460px] px-6 pb-10 lg:px-12">
          <div className="grid grid-cols-4 gap-px bg-[color:var(--rule)] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
            {MEGA_PRODUCTS.map((col) => (
              <div
                key={col.title}
                className={`flex flex-col ${light ? "bg-[color:var(--mist)]/92" : "bg-black/80"}`}
              >
                {/* Column head: the hero's own category icon, then the range */}
                <SmartLink
                  href={col.href}
                  tabIndex={mega ? undefined : -1}
                  className="group flex items-stretch border-b border-[color:var(--rule)] bg-white/[0.04] transition-colors duration-300 hover:bg-white/[0.08]"
                >
                  <span className="flex w-[58px] flex-none items-center justify-center border-r border-[color:var(--rule)] py-4 text-white transition-colors duration-300 group-hover:text-brass">
                    <span
                      aria-hidden
                      style={{
                        maskImage: `url(${asset(col.icon)})`,
                        WebkitMaskImage: `url(${asset(col.icon)})`,
                        maskRepeat: "no-repeat",
                        WebkitMaskRepeat: "no-repeat",
                        maskPosition: "center",
                        WebkitMaskPosition: "center",
                        maskSize: "contain",
                        WebkitMaskSize: "contain",
                      }}
                      className="h-6 w-6 bg-current transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-125"
                    />
                  </span>
                  <span className="flex flex-1 items-center px-5 py-4 text-[15px] font-semibold tracking-[-0.01em] text-white transition-colors duration-300 group-hover:text-brass">
                    {/* Scaled rather than re-sized. Changing font-size would
                        reflow the row and nudge every cell below it; a
                        transform is painted only, so the grid holds still. */}
                    <span className="inline-block origin-left transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]">
                      {col.title}
                    </span>
                  </span>
                </SmartLink>

                {col.items.map((label) => (
                  <SmartLink
                    key={label}
                    href={col.href}
                    tabIndex={mega ? undefined : -1}
                    className="group flex items-stretch border-b border-[color:var(--rule)] transition-colors duration-300 hover:bg-white/[0.05]"
                  >
                    <span className="flex w-[58px] flex-none items-center justify-center border-r border-[color:var(--rule)] py-3.5 text-[color:var(--w-55)] transition-colors duration-300 group-hover:bg-brass group-hover:text-black">
                      <Arrow className="h-[11px] w-[11px] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.35]" />
                    </span>
                    <span className="flex flex-1 items-center px-5 py-3.5 text-[13px] font-medium leading-snug text-[color:var(--w-55)] transition-colors duration-300 group-hover:text-white">
                      <span className="inline-block origin-left transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]">
                        {label}
                      </span>
                    </span>
                  </SmartLink>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 -z-10 bg-black transition-opacity duration-500 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="flex h-full flex-col justify-center gap-1 px-6">
          {NAV.map((item, i) => (
            <SmartLink
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="dsp flex items-baseline gap-5 border-b border-[color:var(--rule)] py-6 text-[30px]"
            >
              <span className="mi text-brass">{String(i + 1).padStart(2, "0")}</span>
              {item.label}
            </SmartLink>
          ))}
          <a href={SITE.phoneHref} className="mi mt-10 text-brass">
            {SITE.phone}
          </a>
        </nav>
      </div>
    </header>
  );
}
