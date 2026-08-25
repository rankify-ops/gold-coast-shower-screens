"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { GALLERY } from "@/content/site";
import { asset } from "@/lib/basePath";
import { SmartLink } from "@/components/ui/SmartLink";
import { Arrow } from "@/components/ui/Arrow";

/** The fixed header's height. The pin has to start below it, not under it. */
const HEADER = 71;

/**
 * (03) — Recent work, as a scroll-driven filmstrip. Ported from /natural.
 *
 * The section above already spends the page's vertical scroll swapping
 * full-height panels, so repeating that here would make two long sections feel
 * like one. This turns the same scroll sideways: the strip pins and the plates
 * travel horizontally past it — a different gesture, still driven by nothing
 * but the scrollbar.
 *
 * The travel is computed from real measurement — the strip's scrollWidth
 * against the viewport — rather than a guessed percentage, so it lands exactly
 * flush on the last plate at any width and with any number of images.
 *
 * THE HEADER CHANGES THE ARITHMETIC. On /natural the pin was top-0 against a
 * full-height child, so the section only needed 100svh + travel and progress
 * was -top / (height - innerHeight). Here the bar is fixed and 71px tall, so
 * the child is (100svh - 71) and pins at 71. The section is therefore
 * (100svh - 71 + travel), and progress is measured from the moment the section
 * top passes 71 rather than 0. Get either half wrong and the strip either
 * starts moving before it pins or is still moving after it unpins.
 *
 * And the pin distance is read off the pinned element, not off innerHeight:
 * svh and window.innerHeight are different numbers whenever browser chrome is
 * in play, and the gap between them is dead scroll at the end of the section.
 *
 * Falls back to an ordinary swipe strip on touch and under reduced motion,
 * where hijacking the scroll is the wrong call.
 */
export function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const [progress, setProgress] = useState(0);
  const [pinned, setPinned] = useState(false);

  /**
   * How far the strip must move for its last plate to land in the same gutter
   * it starts in.
   *
   * NOT scrollWidth. For an overflowing flex row, scrollWidth stops at the last
   * item's edge and omits the container's trailing padding — measured here as
   * 3535 against a content edge of 3535 and a 56px padding-right that was
   * simply not counted, which parked the last plate hard against the viewport
   * while the first had 56px of air.
   *
   * Measuring the last child's right edge against the strip's own left edge is
   * transform-invariant (both move together), so it is safe to call at any
   * scroll position.
   */
  const measure = useCallback(() => {
    const strip = stripRef.current;
    const last = strip?.lastElementChild as HTMLElement | null;
    if (!strip || !last) return;
    const padRight = parseFloat(getComputedStyle(strip).paddingRight) || 0;
    const extent = last.getBoundingClientRect().right - strip.getBoundingClientRect().left;
    setTravel(Math.max(0, extent + padRight - window.innerWidth));
  }, []);

  /**
   * Re-measure once the PINNED layout is actually committed.
   *
   * setPinned(true) happens inside the effect below, so the measure() in that
   * same pass still sees the fallback strip — w-full with overflow-x-auto —
   * rather than the content-width one it becomes a render later. Nothing else
   * re-fired afterwards, so travel stayed at the fallback figure for the life
   * of the page: 2254.66 against a true 2310.66, and the strip stopped 56px
   * short of its gutter. Dispatching a resize by hand corrected it, which is
   * what identified this.
   */
  useEffect(() => {
    if (pinned) measure();
  }, [pinned, measure]);

  useEffect(() => {
    const strip = stripRef.current;
    const section = sectionRef.current;
    if (!strip || !section) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setPinned(true);

    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = section.getBoundingClientRect();
        // Measured off the pinned child ITSELF, never off window.innerHeight.
        // The child is sized in svh and innerHeight is not the same number —
        // on this page they differed by 56px, which left the strip stopping
        // short of flush by exactly that much. Asking the element how tall it
        // ended up is the only version that cannot drift.
        const pin = pinRef.current;
        const scrollable = rect.height - (pin ? pin.offsetHeight : window.innerHeight - HEADER);
        if (scrollable <= 0) return;
        setProgress(Math.min(1, Math.max(0, (HEADER - rect.top) / scrollable)));
      });
    };

    measure();
    onScroll();

    // Re-measure once the webfont lands. The plates are sized by height and
    // aspect, but each figure is as wide as the WIDER of its plate and its
    // caption — so when Geist replaces the fallback face the captions reflow,
    // the strip's extent moves, and a travel measured at mount is stale. Seen
    // here as a stored travel of 2254.66 against a true 2311: the strip would
    // have stopped 56px short of its gutter.
    document.fonts?.ready.then(measure).catch(() => {});

    const ro = new ResizeObserver(measure);
    ro.observe(strip);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const font = "var(--font-geist), ui-sans-serif, system-ui, sans-serif";

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative"
      // The strip's travel is given to the section as extra height. That extra
      // scroll is what the pinned strip spends moving sideways; without it
      // there is nothing to drive the horizontal position.
      style={{
        background: "#ffffff",
        color: "var(--ink)",
        ...(pinned ? { height: `calc(100svh - ${HEADER}px + ${travel}px)` } : {}),
      }}
    >
      <div
        ref={pinRef}
        className={pinned ? "sticky flex flex-col overflow-hidden" : ""}
        style={pinned ? { top: HEADER, height: `calc(100svh - ${HEADER}px)` } : undefined}
      >
        <div className="flex flex-wrap items-end justify-between gap-8 px-8 pt-10 lg:px-14">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[color:var(--sky)]">
              (03) &mdash; Recent work
            </p>
            {/* One line, not two. Stacked it cost the pinned column ~50px of
                height for no gain, and that height belongs to the plates. */}
            <h2
              className="mt-6 text-[clamp(24px,2.6vw,40px)] font-medium leading-[1.1] tracking-[-0.035em]"
              style={{ fontFamily: font }}
            >
              Ten thousand screens.{" "}
              <span className="text-[color:var(--ink-3)]">No two identical.</span>
            </h2>
          </div>

          <div className="flex items-center gap-8">
            {/* Position readout — on a pinned strip the scrollbar no longer
                tells you where you are, so the section has to say it itself. */}
            <p className="hidden text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--ink-3)] lg:block">
              <span className="text-[color:var(--ink)]">
                {String(
                  Math.min(GALLERY.length, Math.round(progress * (GALLERY.length - 1)) + 1)
                ).padStart(2, "0")}
              </span>
              {" / "}
              {String(GALLERY.length).padStart(2, "0")}
            </p>
            <SmartLink
              href="#configurator"
              className="inline-flex items-center gap-3 bg-[color:var(--navy)] px-8 py-4 text-[11px] font-medium uppercase tracking-[0.14em] text-white transition-colors duration-500 hover:bg-[color:var(--navy-lift)]"
            >
              Get a price
              <Arrow />
            </SmartLink>
          </div>
        </div>

        <div className="flex flex-1 items-center overflow-hidden py-6">
          <div
            ref={stripRef}
            className={`flex items-center gap-6 px-8 lg:gap-10 lg:px-14 ${
              pinned ? "" : "w-full snap-x snap-mandatory overflow-x-auto pb-8"
            }`}
            style={
              pinned
                ? {
                    transform: `translate3d(${-progress * travel}px,0,0)`,
                    // No transition: the position is already a direct function
                    // of scroll, and easing it would make the strip lag the
                    // wheel and feel broken rather than smooth.
                    willChange: "transform",
                  }
                : undefined
            }
          >
            {GALLERY.map((item, i) => (
              <figure key={item.name} className="group relative flex-none snap-start">
                {/*
                    Sized by HEIGHT, not width.

                    Fixed vw widths made the tall plates taller than the band
                    left between the heading and the progress rule, so their
                    captions fell off the bottom of a section that cannot be
                    scrolled past vertically. Pinning the height and letting
                    aspect-ratio compute the width keeps every plate inside the
                    viewport at any size, and preserves the tall/short rhythm
                    that stops nine photographs of similar subject matter
                    reading as a contact sheet.

                    56svh. The plate is as tall as the pinned column can carry
                    while still leaving air between the heading and the top of
                    the strip — at 62svh the flex band had so little slack left
                    that centring put the plates 14px under the heading — the strip is the section, so the space
                    belongs to it. Taller plates are also WIDER, which lengthens
                    the strip and therefore the section: travel is measured, so
                    that follows automatically.
                */}
                <div
                  className={`relative h-[clamp(220px,56svh,560px)] overflow-hidden bg-[color:var(--navy)]/5 ${
                    item.tall ? "aspect-[4/5]" : "aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={asset(item.image)}
                    alt={`${item.name}, ${item.finish}`}
                    fill
                    sizes="(max-width: 640px) 76vw, (max-width: 1024px) 44vw, 34vw"
                    className="object-cover transition-transform duration-[1.4s] group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-4 top-4 bg-white/85 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--ink)] backdrop-blur-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--rule)] pt-4">
                  <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--ink)]">
                    {item.name}
                  </span>
                  <span className="rounded-full border border-[color:var(--ink-3)] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--ink)]">
                    {item.finish}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* Progress rule, drawn from the same fraction that moves the strip. */}
        <div className="mx-8 mb-6 h-px bg-[color:var(--rule)] lg:mx-14">
          <div
            className="h-px bg-[color:var(--navy)]"
            style={{ width: `${Math.max(4, progress * 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
