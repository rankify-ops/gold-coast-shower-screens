"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  GlassEffects,
  GLASS_MODES,
  isInteractive,
  type GlassMode,
} from "@/components/ui/GlassEffects";
import { SqueegeeCursor } from "@/components/ui/SqueegeeCursor";
import { Arrow } from "@/components/ui/Arrow";

/**
 * The hero's glass panel: frosted plate, squeegee cursor, and a switcher for
 * the three behaviours.
 *
 * Owns the mode state so the Hero stays a layout component. The switcher sits
 * top-right, inside the panel but above the canvas — it is a real control, so
 * it needs its own pointer events while the canvas below stays inert.
 */
export function GlassPanel({
  src,
  coverOf,
  children,
  className = "",
  tint,
  blur,
}: {
  src: string;
  coverOf: React.RefObject<HTMLElement | null>;
  children: ReactNode;
  className?: string;
  /** The plate's own tint and blur radius. Defaulted in GlassEffects; the
      light hero overrides both — see Hero. */
  tint?: string;
  blur?: number;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const mode: GlassMode = GLASS_MODES[index].id;
  // Only an active effect takes the cursor over. On the default the panel is
  // an ordinary bit of page: normal arrow on the glass, and the browser's own
  // pointer on the category links, which a panel-wide cursor:none was
  // swallowing.
  const live = isInteractive(mode);
  // Wraps both ways, so the arrows never dead-end on the first or last effect.
  const step = (dir: number) =>
    setIndex((i) => (i + dir + GLASS_MODES.length) % GLASS_MODES.length);

  return (
    <div ref={panelRef} className={`relative ${className} ${live ? "lg:cursor-none" : ""}`}>
      <GlassEffects src={src} coverOf={coverOf} mode={mode} tint={tint} blur={blur} />
      {live ? <SqueegeeCursor hostRef={panelRef} /> : null}

      {/* Switcher. cursor-auto so the pointer comes back over the buttons —
          the squeegee is for the glass, not for the controls. */}
      <div className="absolute right-4 top-4 z-20 flex items-center gap-px lg:cursor-auto">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous glass effect"
          className="mi flex h-8 w-8 items-center justify-center border border-white/20 bg-black/35 text-white/70 backdrop-blur-md transition-colors duration-300 hover:bg-white hover:text-black"
        >
          <Arrow dir="left" />
        </button>

        <span
          className="mi flex h-8 min-w-[104px] items-center justify-center border-y border-white/20 bg-black/35 px-3 text-white backdrop-blur-md"
          // Announced as a live region so switching effect with the keyboard
          // says what changed — the visual result is invisible to a screen
          // reader.
          aria-live="polite"
        >
          {GLASS_MODES[index].label}
        </span>

        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next glass effect"
          className="mi flex h-8 w-8 items-center justify-center border border-white/20 bg-black/35 text-white/70 backdrop-blur-md transition-colors duration-300 hover:bg-white hover:text-black"
        >
          <Arrow dir="right" />
        </button>
      </div>

      {children}
    </div>
  );
}
