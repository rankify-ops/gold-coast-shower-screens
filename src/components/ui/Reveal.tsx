"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Two entrances, one observer.
 *
 * `mask` clips and slides display type out from behind a hard edge.
 * `rise` fades and lifts everything else.
 *
 * Both fire once. Elements that re-animate every time they re-enter the
 * viewport make a long page feel restless.
 */
export function Reveal({
  children,
  variant = "rise",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  variant?: "rise" | "mask";
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.shown = "true";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${variant} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* .mask needs a single block child to translate; .rise ignores it. */}
      {variant === "mask" ? <span>{children}</span> : children}
    </div>
  );
}
