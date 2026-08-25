"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HERO, MEGA_PRODUCTS, NAV, SITE } from "@/content/site";
import { asset } from "@/lib/basePath";
import { SmartLink } from "@/components/ui/SmartLink";
import { Arrow } from "@/components/ui/Arrow";

/**
 * The header for /hero-glass: permanently frosted, with a products mega menu.
 *
 * Three things here are not style choices — each one is a bug this project
 * already hit once and fixed:
 *
 *  1. THE FROST IS A SIBLING of both the bar contents and the menu, never
 *     their parent. An element carrying `backdrop-filter` becomes a backdrop
 *     root, and anything nested inside it can then only blur what is painted
 *     within that root — so a menu inside a frosted header comes out flat.
 *
 *  2. CLOSING IS DEFERRED and owned by the <header>. The panel hangs below the
 *     bar, so travelling from a nav item down into it crosses the header's own
 *     padding; an immediate close on the nav shuts the menu before the pointer
 *     ever arrives.
 *
 *  3. THE CLOSE IS INSTANT, and that is the fix for a real bug.
 *
 *     `visibility` is a DISCRETE animatable property: transitioning away from
 *     `visible` flips it at 100%, not at 0. So a 150ms close left the panel
 *     fully painted for the whole 150ms — sliding up eight pixels and then
 *     blinking out. That is the "icons left behind" ghost. duration-0 on the
 *     closed branch flips it on the spot. Opening still animates; only the
 *     exit is immediate, which is what a menu should do anyway.
 *
 *     The frost is also torn down on close rather than left declared. An
 *     element carrying backdrop-filter gets its own compositor layer, and
 *     hiding one via visibility can leave a stale frame behind for a beat.
 *     Dropping the blur classes when the panel is shut removes the layer
 *     outright instead of hiding something that is still composited.
 *
 *  4. THE REVEAL IS TRANSFORM + VISIBILITY, never opacity. Opacity below 1
 *     also forms a backdrop root, so fading the panel in kills its blur for
 *     every frame of the fade and snaps it on at the end. Which is why the
 *     close is fast rather than faded: with opacity ruled out, the only way
 *     for the panel not to linger is for it to be brief.
 *
 *  4. OPENING AND CLOSING RUN AT DIFFERENT SPEEDS, and the plate and the
 *     panel share the closing one. Anything slower than its neighbour on the
 *     way out reads as a ghost.
 */
export function FrostHeader() {
  const [mega, setMega] = useState(false);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMega = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setMega(true);
  }, []);

  const closeMega = useCallback((delay = 180) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMega(false), delay);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Only the close timer is left to clean up.
  useEffect(() => {
    const t = timer;
    return () => {
      if (t.current) clearTimeout(t.current);
    };
  }, []);

  return (
    <header
      onMouseLeave={() => closeMega(0)}
      className="fixed inset-x-0 top-0 z-30"
    >
      {/*
          Frost plate — its own layer.

          The duration is DIRECTIONAL, and that is the whole point. It used to
          be a flat 500ms both ways while the panel closed in 200ms, so at the
          top of the page the menu vanished and left this band still fading
          over the hero for another three hundred milliseconds — a frosted
          ghost of a menu that was no longer there.

          Frosting IN can be leisurely; frosting OUT has to keep up with the
          panel or it outlives it. The after-change style governs a transition,
          so putting the duration in each branch gives one speed per direction.
      */}
      <div
        aria-hidden
        className="absolute inset-0 border-b border-[color:var(--navy)]/12 bg-white/55 backdrop-blur-2xl backdrop-saturate-150"
      />

      {/*
          py-4, not py-7. The bar is 72px now instead of 88 — and the logo went
          UP from 28px to 40px inside it, which is the part that makes it read
          as streamlined rather than merely shorter. A shallow bar with a small
          mark just looks thin; a shallow bar with a confident mark looks tight.
      */}
      <div className="relative flex items-center justify-between gap-8 px-8 py-4 lg:px-14">
        <SmartLink href="#top" aria-label={SITE.name} className="flex-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/img/logos/Gold-Coast-Screens-Logo-1.svg")}
            alt={SITE.name}
            className="h-8 w-auto lg:h-9"
          />
        </SmartLink>

        <nav className="hidden items-center gap-10 lg:flex">
          {NAV.map((item) => {
            // Only Products opens the panel; every other item closes it, so
            // sliding along the row never leaves it hanging open.
            const isProducts = item.href === "#products";
            return (
              <SmartLink
                key={item.label}
                href={item.href}
                onMouseEnter={() => (isProducts ? openMega() : closeMega(0))}
                onFocus={() => (isProducts ? openMega() : closeMega(0))}
                aria-expanded={isProducts ? mega : undefined}
                // Full navy at rest, never a faded one. Hover is signalled by
                // a brass rule under the word rather than by a change in the
                // ink — dimming type to show it is NOT hovered leaves the bar
                // looking washed out in its normal state, which is how this
                // read before.
                className="text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--navy)] underline-offset-[6px] decoration-[color:var(--brass)] decoration-2 transition-all duration-300 hover:underline"
              >
                {item.label}
              </SmartLink>
            );
          })}
        </nav>

        <div className="flex flex-none items-center gap-7">
          <a
            href={SITE.phoneHref}
            className="hidden text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--navy)] underline-offset-[6px] decoration-[color:var(--brass)] decoration-2 transition-all duration-300 hover:underline sm:block"
          >
            {SITE.phone}
          </a>
          {/* Desktop only — on a phone this pill eats most of the bar. */}
          <SmartLink
            href="#configurator"
            className="hidden rounded-full border border-[color:var(--navy)]/25 px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--navy)] transition-colors duration-500 hover:border-[color:var(--navy)] hover:bg-[color:var(--navy)] hover:text-white lg:block"
          >
            {HERO.cta}
          </SmartLink>

          {/* …and the hamburger takes its place there. */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Menu"}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[6px] lg:hidden"
          >
            <span
              className={`h-px w-6 bg-[color:var(--navy)] transition-transform duration-300 ${
                open ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-6 bg-[color:var(--navy)] transition-transform duration-300 ${
                open ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile sheet. */}
      <div
        className={`fixed inset-0 -z-10 transition-opacity duration-500 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ background: "#f0eeed" }}
      >
        <nav className="flex h-full flex-col justify-center gap-1 px-8">
          {NAV.map((item, i) => (
            <SmartLink
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-5 border-b border-[color:var(--navy)]/12 py-5 text-[28px] font-medium tracking-[-0.03em] text-[color:var(--navy)]"
            >
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--brass)]">
                /0{i + 1}
              </span>
              {item.label}
            </SmartLink>
          ))}

          <SmartLink
            href="#configurator"
            onClick={() => setOpen(false)}
            className="mt-10 flex items-center justify-center gap-3 bg-[color:var(--navy)] px-8 py-4 text-[11px] font-medium uppercase tracking-[0.14em] text-white"
          >
            {HERO.cta}
            <Arrow />
          </SmartLink>

          <a
            href={SITE.phoneHref}
            className="mt-4 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--navy)]/60"
          >
            {SITE.phone}
          </a>
        </nav>
      </div>

      {/* Mega menu — a sibling of the frost, so its own blur still works. */}
      {/*
          MOUNTED ONLY WHILE OPEN. This is not a tidiness choice.

          Hiding the panel was never enough. Each category mark is a span with
          a mask-image, and mask-image promotes an element to its own
          compositor layer — a promoted layer can outlive `visibility: hidden`
          by a frame or two, which is exactly why the ICONS were left hanging
          after the menu shut while the text beside them vanished cleanly.
          There is nothing to leave behind if the subtree does not exist.

          The open animation is a keyframe rather than a transition, because a
          transition cannot run on the frame an element first appears.
      */}
      {mega && (
        <div className="absolute inset-x-0 top-full hidden animate-[mega-in_300ms_cubic-bezier(0.16,1,0.3,1)] lg:block">
        {/*
            The cell grid, unchanged from the version that worked. gap-px over
            a hairline ground draws every divider as a single line that cannot
            double up where cells meet, and each row splits into a fixed icon
            cell and a flexible label cell so the icons line up down the column.

            Rows are NOT flex-1. Letting them stretch makes each column divide
            its height by its own row count, so a 4-item column and a 5-item
            column stop lining up across the grid.

            Every row keeps its bottom rule, including the last, so the shorter
            columns close off instead of trailing into an open box.
        */}
        <div className="mx-auto max-w-[1500px] px-8 pb-8 lg:px-14">
          {/* Same recipe as the bar's own plate, so the two read as one sheet
              of glass rather than a frosted bar with a solid card hanging off
              it. */}
          {/* border-x and border-b, never border-t. The panel sits flush
              against the bar, so a top edge here would sit directly on the
              header's own bottom hairline and draw it twice as thick. */}
          <div
            className={`border-x border-b border-[color:var(--navy)]/12 ${
              mega ? "bg-white/55 backdrop-blur-2xl backdrop-saturate-150" : ""
            }`}
          >
            {/* Open/close intent lives on the GRID, not the wrapper. The
                wrapper is full-bleed, so hovering the empty space to either
                side of the columns counted as being in the menu and held it
                open.

                COLUMN DIVIDERS ARE BORDERS, not a gap over a coloured ground.
                The gap technique needs opaque cells to mask the ground, and
                opaque cells paint straight over the backdrop-filter behind
                them — the panel had a working blur that nothing could see.
                Borders let every cell stay transparent, so the frost is the
                background. Written as an explicit [&>*+*]:border-l rather than
                divide-x, which resolved to a 0px width here. */}
            <div
              onMouseEnter={openMega}
              onMouseLeave={() => closeMega(0)}
              className="grid grid-cols-4 [&>*+*]:border-l [&>*+*]:border-[color:var(--navy)]/12"
            >
              {MEGA_PRODUCTS.map((col) => (
                <div key={col.title} className="flex flex-col">
                  <SmartLink
                    href={col.href}
                    tabIndex={mega ? undefined : -1}
                    className="group flex items-stretch border-b border-[color:var(--navy)]/12 bg-[color:var(--navy)]/[0.05] transition-colors duration-300 hover:bg-[color:var(--navy)]"
                  >
                    <span className="flex w-[58px] flex-none items-center justify-center border-r border-[color:var(--navy)]/12 py-4 transition-colors duration-300 group-hover:border-white/20">
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
                        className="h-6 w-6 bg-[color:var(--navy)] transition-all duration-300 group-hover:bg-white group-hover:scale-125"
                      />
                    </span>
                    <span className="flex flex-1 items-center px-5 py-4 text-[13px] font-medium tracking-[-0.01em] text-[color:var(--navy)] transition-colors duration-300 group-hover:text-white">
                      <span className="inline-block origin-left transition-transform duration-300 group-hover:scale-[1.07]">
                        {col.title}
                      </span>
                    </span>
                  </SmartLink>

                  {col.items.map((label) => (
                    <SmartLink
                      key={label}
                      href={col.href}
                      tabIndex={mega ? undefined : -1}
                      className="group flex items-stretch border-b border-[color:var(--navy)]/12 transition-colors duration-300 hover:bg-[color:var(--navy)]"
                    >
                      {/* Hover: the row fills navy, and the square, the arrow
                          and the label all go white with it. */}
                      <span className="flex w-[58px] flex-none items-center justify-center border-r border-[color:var(--navy)]/12 py-3.5 text-[color:var(--navy)]/70 transition-colors duration-300 group-hover:border-white/20 group-hover:text-white">
                        <Arrow className="h-[11px] w-[11px] transition-transform duration-300 group-hover:scale-[1.35]" />
                      </span>
                      <span className="flex flex-1 items-center px-5 py-3.5 text-[13px] leading-snug text-[color:var(--navy)] transition-colors duration-300 group-hover:text-white">
                        <span className="inline-block origin-left transition-transform duration-300 group-hover:scale-[1.06]">
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
        </div>
      )}
    </header>
  );
}
