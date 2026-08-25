"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/basePath";

/**
 * A Lottie icon that plays once when it arrives and replays on hover.
 *
 * These are Lordicon "hover-pinch" animations, authored as one-shots, but they
 * run on an infinite loop here by request. Two consequences worth knowing:
 *
 *  - Six animations run continuously for as long as the section is on screen.
 *    That is real CPU. It is bounded by the lazy load below — nothing runs
 *    until the section is actually reached — and by lottie-web pausing itself
 *    when the document is hidden, but it does not stop while the section is in
 *    view.
 *  - A one-shot looped has no rest state, so the icons never settle. Hover
 *    still restarts them from frame zero, which is the only way to get a
 *    distinct response out of an animation that is already playing.
 *
 * FOUR THINGS ARE DELIBERATE:
 *
 *  1. NOTHING LOADS UNTIL IT IS NEEDED. Both the player and the JSON are
 *     fetched only when the icon comes within 200px of the viewport. Six of
 *     these eagerly loaded would be a quarter of a megabyte spent on a section
 *     most visitors scroll past. The trigger is a mount-time measurement FIRST
 *     and an observer second — see below for why the observer alone is not
 *     enough.
 *
 *  2. THE BOX IS SIZED IN CSS, NOT BY THE PLAYER. lottie-web measures its
 *     container on init; if it mounts before layout settles it renders at 0x0
 *     and never recovers. An explicit width and height on the host element
 *     makes that impossible.
 *
 *  3. REDUCED MOTION STILL DOES NOT LOOP. It gets the last frame and stays
 *     there. Looping motion is precisely what that setting asks sites not to
 *     do, and `goToAndStop` on the final frame leaves the icon resolved — an
 *     outline icon's first frame is often half-drawn.
 *
 *  4. HOVER IS BOUND TO THE CARD, not the icon. The icon is 54px in a 390px
 *     card; requiring a hover on the glyph itself would make the interaction
 *     almost undiscoverable. The parent passes `hovered` down.
 */
export function LottieIcon({
  src,
  size = 54,
  hovered = false,
  className = "",
}: {
  /** Path under /public, e.g. "/lottie/customer-service.json" */
  src: string;
  size?: number;
  hovered?: boolean;
  className?: string;
}) {
  const host = useRef<HTMLSpanElement>(null);
  // Typed loosely on purpose: lottie-web's AnimationItem type is only
  // available once the dynamic import resolves.
  const anim = useRef<{
    play: () => void;
    stop: () => void;
    goToAndStop: (v: number, isFrame?: boolean) => void;
    destroy: () => void;
    totalFrames: number;
  } | null>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    // Measure once on mount before handing over to the observer.
    //
    // IntersectionObserver only reports a CHANGE in intersection, and in some
    // conditions — a throttled or background tab among them — that first
    // callback can be delayed or never arrive. An icon that is already on
    // screen at mount would then wait forever and simply never appear. A
    // single getBoundingClientRect covers that case outright, and the observer
    // still handles everything scrolled to later.
    const band = 200;
    const inView = () => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight + band && r.bottom > -band;
    };
    if (inView()) {
      setNear(true);
      return;
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: `${band}px` }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!near || !host.current) return;
    let dead = false;

    (async () => {
      // The light build is SVG-only, which is all these need, and roughly half
      // the size of the full player.
      const lottie = (await import("lottie-web/build/player/lottie_light")).default;
      const data = await fetch(asset(src)).then((r) => r.json());
      if (dead || !host.current) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const a = lottie.loadAnimation({
        container: host.current,
        renderer: "svg",
        loop: true,
        autoplay: false,
        animationData: data,
      });
      anim.current = a as unknown as typeof anim.current;

      if (reduced) a.goToAndStop(a.totalFrames - 1, true);
      else a.play();
    })();

    return () => {
      dead = true;
      anim.current?.destroy();
      anim.current = null;
    };
  }, [near, src]);

  // Hover restarts from the top. The loop is already running, so this is a
  // deliberate re-trigger rather than a play/pause — without the stop() it
  // would do nothing at all, since play() on a running animation is a no-op.
  useEffect(() => {
    if (!hovered || !anim.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    anim.current.stop();
    anim.current.play();
  }, [hovered]);

  return (
    <span
      ref={host}
      aria-hidden
      className={`block flex-none ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
