"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A squeegee that replaces the pointer while it is over the glass panel.
 *
 * Positioned with a transform written straight to the node on pointermove
 * rather than through React state — a re-render per mouse move would be
 * dozens a second for a purely visual element, and it lags the real cursor
 * noticeably. State is used only for the visible/hidden flip, which happens
 * twice per hover.
 *
 * The blade tilts toward the direction of travel, so a horizontal sweep looks
 * like a wipe rather than a sticker being dragged.
 */
export function SqueegeeCursor({ hostRef }: { hostRef: React.RefObject<HTMLElement | null> }) {
  const elRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const tiltRef = useRef(0);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const el = elRef.current;
    if (!host || !el) return;

    // No hover means no cursor to replace.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    function onMove(e: PointerEvent) {
      const prev = lastRef.current;
      lastRef.current = { x: e.clientX, y: e.clientY };

      if (prev) {
        const dx = e.clientX - prev.x;
        // Lean up to 14 degrees, eased toward the target so the blade settles
        // instead of snapping on every jitter.
        const target = Math.max(-14, Math.min(14, dx * 0.7));
        tiltRef.current += (target - tiltRef.current) * 0.25;
      }

      el!.style.transform =
        `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) rotate(${tiltRef.current.toFixed(2)}deg)`;
    }

    const onEnter = () => setShown(true);
    const onLeave = () => {
      setShown(false);
      lastRef.current = null;
    };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [hostRef]);

  return (
    <div
      ref={elRef}
      aria-hidden
      className={`pointer-events-none fixed left-0 top-0 z-[70] hidden transition-opacity duration-200 lg:block ${
        shown ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex flex-col items-center">
        {/* Handle */}
        <span className="block h-5 w-[3px] rounded-full bg-white/80" />
        {/* Blade — the wide edge that reads as the thing doing the wiping */}
        <span className="mt-[2px] block h-[7px] w-[74px] rounded-[2px] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.45)]" />
        {/* Rubber lip */}
        <span className="block h-[3px] w-[74px] rounded-b-[2px] bg-[color:var(--brass)]" />
      </div>
    </div>
  );
}
