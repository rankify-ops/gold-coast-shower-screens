"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The pieces every /refresh section is built from.
 *
 * Kept together because they are a vocabulary rather than components in their
 * own right — a section label, a bar button, a reveal. Splitting three
 * twenty-line primitives across three files would only make the section
 * components harder to read.
 */

/** ▪ 03 — SERVICES. The coral tick, the number, the word. */
export function Label({ n, children }: { n: string; children: ReactNode }) {
  return (
    <p className="hz-mono flex items-center text-[color:var(--hz-ink)]">
      <span className="hz-tick" />
      <span className="hz-dim mr-3">{n}</span>
      {children}
    </p>
  );
}

/** The bar-with-a-coral-square control. */
export function BarButton({
  children,
  note,
  href = "#configurator",
  onClick,
}: {
  children: ReactNode;
  note?: string;
  href?: string;
  onClick?: () => void;
}) {
  return (
    <a href={href} onClick={onClick} className="hz-btn group">
      <span className="hz-mono">
        {children}
        {note ? <span className="opacity-45">{note}</span> : null}
      </span>
      <span aria-hidden>
        <svg viewBox="0 0 10 10" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 5h6M5.4 2.2 8.2 5l-2.8 2.8" />
        </svg>
      </span>
    </a>
  );
}

/**
 * Scroll reveal.
 *
 * The reference animates entries as a short rise with a fade, staggered by
 * position rather than all at once. Deliberately re-armed on exit: the
 * template replays as you scroll back up, and a one-shot reveal reads as
 * broken next to one that does not.
 */
export function Rise({
  children,
  delay = 0,
  as: As = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => setSeen(e.isIntersecting),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <As
      // @ts-expect-error — ref type varies with the polymorphic tag
      ref={ref}
      className={className}
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? "none" : "translateY(26px)",
        transition: `opacity 900ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 900ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </As>
  );
}

/**
 * Count-up that replays, in the template's `0k` style.
 *
 * Renders the real figure server-side so the number is in the shipped HTML,
 * then counts from zero once it is both mounted and in view.
 */
export function Tally({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let start = 0;
    const D = 1600;
    const fmt = new Intl.NumberFormat("en-AU");

    const step = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / D);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      el.textContent = (t === 1 ? fmt.format(to) : fmt.format(Math.round(to * eased))) + suffix;
      if (t < 1) raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (raf) cancelAnimationFrame(raf);
          start = 0;
          raf = requestAnimationFrame(step);
        } else {
          if (raf) cancelAnimationFrame(raf);
          raf = 0;
          el.textContent = fmt.format(to) + suffix;
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [to, suffix, mounted]);

  return <span ref={ref}>{new Intl.NumberFormat("en-AU").format(to) + suffix}</span>;
}
