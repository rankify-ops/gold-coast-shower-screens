"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { EstimatorModal } from "@/components/estimator/EstimatorModal";

const Ctx = createContext<{ open: () => void }>({ open: () => {} });

/** `const { open } = useEstimator()` from any client component. */
export function useEstimator() {
  return useContext(Ctx);
}

/**
 * Holds the estimator modal for the whole page, so every "Get an Instant
 * Estimate" button opens the same one rather than each CTA carrying its own
 * copy of the state.
 *
 * Clicks on `#configurator` links are intercepted on `document`, in the
 * capture phase. Both halves of that matter:
 *
 *   document — the floating CTA bar renders as a sibling of this provider,
 *   not a descendant, so a wrapper div around `children` missed it. Its
 *   clicks set the hash and scrolled the page while the modal stayed shut.
 *
 *   capture — SmartLink sits on the anchor itself and owns same-page hashes:
 *   it calls scrollIntoView and rewrites the URL. On the bubble phase that has
 *   already happened by the time we see the click, which is what made the page
 *   jump to the configurator section before the modal appeared. Capturing at
 *   document runs ahead of React's own listeners, and stopping the event there
 *   means SmartLink never runs at all — nothing scrolls, the URL is untouched.
 *
 * It degrades honestly: with JS off the links still jump to the configurator
 * section, which asks the same questions inline.
 */
export function EstimatorProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Let modified clicks through — someone opening in a new tab wants the
      // page, not a modal.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

      const link = (e.target as HTMLElement | null)?.closest?.("a");
      if (!link) return;
      if (!(link.getAttribute("href") || "").endsWith("#configurator")) return;

      e.preventDefault();
      e.stopPropagation();
      open();
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [open]);

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      <EstimatorModal open={isOpen} onClose={close} />
    </Ctx.Provider>
  );
}
