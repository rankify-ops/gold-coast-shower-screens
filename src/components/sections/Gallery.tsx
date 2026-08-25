"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SmartLink } from "@/components/ui/SmartLink";
import { GALLERY } from "@/content/site";
import { asset } from "@/lib/basePath";
import { Arrow } from "@/components/ui/Arrow";

/**
 * Recent work, as a scroll-driven filmstrip.
 *
 * The section above already uses the page's vertical scroll to swap full-height
 * panels, so repeating that here would make two long sections feel like one.
 * This one turns the same scroll sideways instead: the strip pins to the
 * viewport and the plates travel horizontally past it, which reads as a
 * different gesture entirely while still being driven by nothing but the
 * scrollbar.
 *
 * The travel is computed from real measurements — the strip's scrollWidth
 * against the viewport — rather than a guessed percentage, so it lands exactly
 * flush on the last plate at any width and with any number of images.
 *
 * The tall/short rhythm from the old grid is kept: alternating plate heights
 * stop nine photographs of similar subject matter reading as a contact sheet.
 *
 * Falls back to a normal horizontal swipe strip on touch and under
 * reduced-motion, where hijacking the scroll is the wrong call.
 */
export function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const [progress, setProgress] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const strip = stripRef.current;
    const section = sectionRef.current;
    if (!strip || !section) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setPinned(true);

    let frame = 0;

    // How far the strip has to move for its last plate to sit flush right.
    const measure = () => setTravel(Math.max(0, strip.scrollWidth - window.innerWidth));

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = section.getBoundingClientRect();
        // The section is taller than the viewport by exactly the travel
        // distance, so scrolled-past / scrollable-height is the strip's
        // position as a 0-1 fraction.
        const scrollable = rect.height - window.innerHeight;
        if (scrollable <= 0) return;
        setProgress(Math.min(1, Math.max(0, -rect.top / scrollable)));
      });
    };

    measure();
    onScroll();
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

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative bg-paper"
      // The section is given the strip's travel as extra height. That extra
      // scroll is what the pinned strip spends moving sideways; without it
      // there would be nothing to drive the horizontal position.
      style={pinned ? { height: `calc(100svh + ${travel}px)` } : undefined}
    >
      <div className={pinned ? "sticky top-0 flex h-svh flex-col overflow-hidden" : ""}>
        <div className="layer flex flex-wrap items-end justify-between gap-8 px-6 pt-24 lg:px-12 lg:pt-20">
          <div>
            <p className="mi text-[color:var(--ink-38)]">(03) &mdash; Recent work</p>
            <h2 className="dsp-sm mt-8 max-w-[16ch] text-[clamp(26px,3.4vw,48px)]">
              Ten thousand screens.
            </h2>
            <h2 className="dsp-sm dim max-w-[16ch] text-[clamp(26px,3.4vw,48px)]">
              No two identical.
            </h2>
          </div>

          <div className="flex items-center gap-8">
            {/* Position readout — on a pinned strip the scrollbar no longer
                tells you where you are, so the section has to say it itself. */}
            <p className="mi hidden text-[color:var(--ink-38)] lg:block">
              <span className="text-ink">
                {String(Math.min(GALLERY.length, Math.round(progress * (GALLERY.length - 1)) + 1)).padStart(2, "0")}
              </span>
              {" / "}
              {String(GALLERY.length).padStart(2, "0")}
            </p>
            <SmartLink href="#configurator" className="mi btn">
              Get a price
              <Arrow />
            </SmartLink>
          </div>
        </div>

        <div className="layer flex flex-1 items-center overflow-hidden">
          <div
            ref={stripRef}
            className={`flex items-center gap-6 px-6 lg:gap-10 lg:px-12 ${
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
                    captions fell off the bottom of a pinned section that
                    cannot be scrolled past vertically. Pinning the height and
                    letting aspect-ratio compute the width keeps every plate
                    inside the viewport at any size, and preserves the
                    tall/short rhythm.
                */}
                <div
                  className={`relative h-[clamp(200px,42svh,430px)] overflow-hidden bg-mist ${
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
                  <span className="mi absolute left-4 top-4 bg-paper/90 px-2.5 py-1 text-ink backdrop-blur-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <figcaption className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--rule-dark)] pt-4">
                  <span className="mi text-ink">{item.name}</span>
                  <span className="mi rounded-full border border-[color:var(--rule-dark)] px-3 py-1.5 text-[color:var(--ink-38)]">
                    {item.finish}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* Progress rule, drawn from the same fraction that moves the strip. */}
        <div className="layer mx-6 mb-8 h-px bg-[color:var(--rule-dark)] lg:mx-12">
          <div
            className="h-px bg-navy"
            style={{ width: `${Math.max(4, progress * 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
