const STAR = "M12 1.6l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.4l-6.2 3.3L7 13.8 2 8.9l6.9-1z";

/**
 * Five filled stars, coloured by `currentColor`.
 *
 * A flex row of small SVGs rather than one SVG with positioned instances —
 * spacing is then just a gap, with no transform maths to get wrong, and each
 * star scales cleanly with the font size around it.
 *
 * The group carries `role="img"` and a label because five glyphs say nothing
 * to a screen reader; the rating has to be stated in words.
 */
export function Stars({
  count = 5,
  size = 13,
  className = "",
  label = "Rated 5 out of 5",
}: {
  count?: number;
  size?: number;
  className?: string;
  label?: string;
}) {
  return (
    <span role="img" aria-label={label} // className last, so a caller can override the default gap.
      className={`inline-flex items-center gap-[3px] ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          width={size}
          height={size}
          aria-hidden
          focusable="false"
          className="block flex-none"
        >
          <path d={STAR} fill="currentColor" />
        </svg>
      ))}
    </span>
  );
}
