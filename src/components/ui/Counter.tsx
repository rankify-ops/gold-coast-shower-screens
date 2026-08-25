"use client";

import { useEffect, useRef, useState } from "react";

const FORMAT = new Intl.NumberFormat("en-AU");

/**
 * Count-up that is correct first and animated second.
 *
 * Replays on every entry into the viewport rather than firing once and
 * disconnecting, so scrolling back up to the figures runs them again.
 *
 * Two things the off-the-shelf spring versions get wrong for a trust stat:
 *
 *  1. A spring approaches its target asymptotically, so "8,000" can settle at
 *     7,998. On a number the client is making a claim with, that is not a
 *     rounding detail — it is wrong. This tweens on a fixed duration and
 *     assigns the exact target on the final frame.
 *
 *  2. They render an empty (or zero) span on the server. This is a static
 *     export, so the figure would be missing from the shipped HTML entirely —
 *     bad for search, and gone for anyone without JS. Here the real number is
 *     the server-rendered content and the animation only takes over once it
 *     is both mounted and in view.
 */
export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Decorative, so under reduced-motion leave the server-rendered figure
    // exactly where it is and never animate.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let start = 0;
    const DURATION = 1500;

    // Transform and blur need a block box; the span is inline by default.
    el.style.display = "inline-block";
    el.style.fontVariantNumeric = "tabular-nums";
    el.style.willChange = "transform, filter";

    const step = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / DURATION);
      // easeOutExpo — fast out of the gate, long settle, which reads as
      // "counting" rather than "sliding".
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      // The final frame assigns `to` itself rather than a computed value, so
      // the number that comes to rest is always exactly right.
      el.textContent = (t === 1 ? FORMAT.format(to) : FORMAT.format(Math.round(to * eased))) + suffix;

      // The digits resolve as they climb — rising, blurred and pale at the
      // start, sharp and settled at the end. It is the same trick a mechanical
      // counter plays: the eye reads motion first and the figure second, so
      // the number lands rather than merely stopping.
      const away = 1 - eased;
      el.style.transform = `translateY(${(away * 14).toFixed(2)}px)`;
      el.style.filter = away > 0.001 ? `blur(${(away * 6).toFixed(2)}px)` : "none";
      el.style.opacity = String(0.25 + 0.75 * eased);

      if (t < 1) raf = requestAnimationFrame(step);
    };

    const run = () => {
      if (raf) cancelAnimationFrame(raf);
      start = 0;
      el.textContent = FORMAT.format(0) + suffix;
      raf = requestAnimationFrame(step);
    };

    // Not disconnected on the first hit: the count replays every time the
    // figure comes back into view. Leaving the viewport cancels whatever is
    // mid-flight and parks the number at its final value, so scrolling away
    // during the count never strands it on a half-counted figure.
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          run();
          return;
        }
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        el.textContent = FORMAT.format(to) + suffix;
        el.style.transform = "none";
        el.style.filter = "none";
        el.style.opacity = "1";
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [to, suffix, mounted]);

  return <span ref={ref}>{FORMAT.format(to) + suffix}</span>;
}
