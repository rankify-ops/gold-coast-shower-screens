/**
 * The site's arrow.
 *
 * Drawn rather than typed. The `&rarr;` glyph these replace came from Geist,
 * so its weight was tied to the font's and it sat on the text baseline —
 * next to uppercase micro-type it read heavier than everything around it and
 * never quite lined up. As strokes it matches the hairline rules the whole
 * page is built from, inherits `currentColor`, and scales with the button
 * rather than with the type.
 *
 * `ne` is the default and the one used on every call to action. The left and
 * right variants exist only for genuine directional controls — the glass
 * panel's effect switcher and the estimator's Back — where a diagonal would
 * be saying the wrong thing.
 */
export function Arrow({
  dir = "ne",
  className = "h-[11px] w-[11px]",
}: {
  dir?: "ne" | "left" | "right";
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 10 10"
      aria-hidden
      className={`flex-none ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="square"
    >
      {dir === "ne" ? (
        <>
          <path d="M2.4 7.6 L7.6 2.4" />
          <path d="M3.4 2.4 H7.6 V6.6" />
        </>
      ) : dir === "right" ? (
        <>
          <path d="M1.5 5 H8.3" />
          <path d="M5.5 2.2 L8.3 5 L5.5 7.8" />
        </>
      ) : (
        <>
          <path d="M8.5 5 H1.7" />
          <path d="M4.5 2.2 L1.7 5 L4.5 7.8" />
        </>
      )}
    </svg>
  );
}
