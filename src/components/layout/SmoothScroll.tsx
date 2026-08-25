"use client";

import { useEffect } from "react";

/**
 * Turns smooth scrolling on only after the page has finished loading.
 *
 * `scroll-behavior: smooth` on html makes Chrome animate its scroll
 * restoration on reload rather than jumping straight to the saved offset.
 * While that animation runs the page is still growing as images arrive, so it
 * lands well below where you were. Restoring instantly and enabling smooth
 * afterwards keeps anchor links smooth without hijacking the reload.
 */
export function SmoothScroll() {
  useEffect(() => {
    const enable = () => document.documentElement.classList.add("smooth-scroll");

    if (document.readyState === "complete") {
      enable();
      return;
    }

    window.addEventListener("load", enable, { once: true });
    return () => window.removeEventListener("load", enable);
  }, []);

  return null;
}
