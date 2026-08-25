import type { ReactNode } from "react";

/**
 * Hairline panel with a registration dot at each corner — the "selected
 * artboard" motif. The empty span carries the two lower dots on its
 * pseudo-elements; see .board in globals.css.
 */
export function Board({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`board ${className}`}>
      <span aria-hidden className="board-c" />
      {children}
    </div>
  );
}
