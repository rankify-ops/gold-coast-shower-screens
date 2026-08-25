"use client";

import { useEffect, useRef } from "react";
import { buildLens, coverToImageData, renderPane } from "@/lib/refract";

/**
 * A real sheet of fluted glass that slides in from the right and can be dragged.
 *
 * The distortion is the transform from franky-adl/fractal-glass-gradients —
 * see lib/refract for the maths and for why the vertical term matters.
 *
 * WHAT THIS IS, AND WHAT THE PREVIOUS VERSION WAS
 *
 * The version before this pre-rendered the whole plate as glass and then slid
 * a window across it. That is a REVEAL: the reeds stay welded to the
 * photograph and the moving edge just uncovers them. It looks like a wipe
 * transition, not like glass.
 *
 * Here the reeds live in PANE-LOCAL coordinates. The lens is rebuilt every
 * frame from the pane's current position, so the whole refraction pattern
 * travels with the sheet — the ridges move across the shower head, the
 * scalloped tearing at each flute edge sweeps along with them, and it reads as
 * a physical object being pushed over the image.
 *
 * That rules out pre-rendering entirely: refraction is a resampling, so the
 * output at x and at x + δ are not related by a translation. Every frame is a
 * fresh ~1M-sample remap, which is why lib/refract hoists the vertical floor
 * out of the row loop and drops chromatic dispersion while in motion.
 * Dispersion comes back on the frame the pane settles.
 */
export function FlutedGlass({
  src,
  from = 0.44,
  fluteWidth = 26,
  strength = 22,
  tone = "light",
  entrance = true,
  draggable = true,
  className = "",
}: {
  src: string;
  /** Resting position of the pane's left edge, as a fraction of width. */
  from?: number;
  fluteWidth?: number;
  strength?: number;
  tone?: "light" | "dark";
  entrance?: boolean;
  draggable?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const host = cv?.parentElement;
    if (!cv || !host) return;

    const img = new Image();
    // 1x copy of the plate — the refraction maths all works in CSS pixels.
    const sharp = document.createElement("canvas");
    // The pane is rendered here at 1x, then drawn up into the DPR canvas.
    const paneCanvas = document.createElement("canvas");
    let dpr = 1;

    let W = 0;
    let H = 0;
    let source: ImageData | null = null;
    // One buffer, reused for every frame. Allocating a ~7MB ImageData per
    // frame cost both the allocation and the zero-fill, and fed the collector
    // during the exact seconds the pane is moving.
    let paneBuf: ImageData | null = null;
    //
    // NO half-resolution path.
    //
    // There was one — render at 0.5 while moving, upscale, restore full
    // detail on settle. It hit the frame budget easily and looked awful: the
    // pane pixelated over the shower head on precisely the frames anyone is
    // watching. Sharpness during the motion matters more here than hitting 60,
    // so the renderer was optimised instead (see lib/refract) and every frame
    // is now drawn at full resolution.

    let edge = 0;
    let rest = 0;
    let raf = 0;
    let ready = false;
    let dragging = false;
    let grabOffset = 0;
    let moving = false;

    const ctx = cv.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function build() {
      const rect = host!.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      if (!img.naturalWidth) return;

      // The VISIBLE canvas gets a device-pixel backing store, so the sharp
      // half of the plate is drawn at the display's real resolution instead of
      // being upscaled by the browser. On a 1x screen this changes nothing; on
      // a scaled one it is the difference between crisp and soft, and it was
      // the larger of the two quality losses here.
      //
      // The refraction still runs in CSS pixels. It is a per-pixel loop, and
      // at 2x DPR it would be four times the work — so the pane is rendered at
      // 1x and drawn up, while the sharp plate underneath stays native.
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv!.width = Math.round(W * dpr);
      cv!.height = Math.round(H * dpr);
      cv!.style.width = rect.width + "px";
      cv!.style.height = rect.height + "px";
      sharp.width = W;
      sharp.height = H;

      const sctx = sharp.getContext("2d", { willReadFrequently: true })!;
      source = coverToImageData(sctx, img, W, H);

      // One reusable buffer, full plate width — the pane never exceeds it.
      paneBuf = new ImageData(W, H);

      rest = Math.round(W * from);
      if (!ready) {
        edge = entrance && !reduced ? W : rest;
        ready = true;
      }
    }

    function paint() {
      if (!ready || !source || !paneBuf) return;

      // Draw in CSS pixels; the transform maps them onto device pixels.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      // Straight from the image, not the 1x copy — this is the crisp half.
      const cover = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      const cw = img.naturalWidth * cover;
      const ch = img.naturalHeight * cover;
      ctx.drawImage(img, (W - cw) / 2, (H - ch) / 2, cw, ch);

      const e = Math.round(edge);
      if (e >= W) return;

      const paneW = W - e;

      // Reeds in PANE-LOCAL space — origin at the pane's own left edge — so the
      // whole pattern travels with the sheet rather than staying pinned to the
      // photograph.
      const lens = buildLens(paneW, fluteWidth, strength, 0, tone);

      renderPane(source, paneBuf, e, lens, moving ? 0 : tone === "light" ? 0.8 : 0.55);

      // putImageData ignores the canvas transform and writes device pixels, so
      // it cannot go straight onto a DPR-scaled canvas. Via a 1x canvas and
      // drawImage instead, which respects the transform.
      paneCanvas.width = paneW;
      paneCanvas.height = H;
      paneCanvas.getContext("2d")!.putImageData(paneBuf, 0, 0, 0, 0, paneW, H);
      ctx.drawImage(paneCanvas, e, 0);

      // The pane's leading edge — a soft band, and a short grab handle so it
      // reads as an object you can take hold of.
      const g = ctx.createLinearGradient(e - 22, 0, e + 10, 0);
      g.addColorStop(0, "rgba(255,255,255,0)");
      g.addColorStop(0.6, tone === "light" ? "rgba(255,255,255,0.34)" : "rgba(255,255,255,0.2)");
      g.addColorStop(1, "rgba(255,255,255,0.06)");
      ctx.fillStyle = g;
      ctx.fillRect(e - 22, 0, 32, H);

      if (draggable) {
        const cy = H / 2;
        ctx.fillStyle = tone === "light" ? "rgba(26,26,26,0.3)" : "rgba(255,255,255,0.42)";
        for (let i = -1; i <= 1; i++) ctx.fillRect(e - 7, cy + i * 9 - 12, 14, 1);
      }
    }

    /** Clock starts on the first frame, so a backgrounded load still animates. */
    function slideIn() {
      const D = 1600;
      let t0 = 0;
      moving = true;
      const step = (now: number) => {
        if (!t0) t0 = now;
        const t = Math.min(1, (now - t0) / D);
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -9 * t);
        edge = W + (rest - W) * eased;
        if (t === 1) moving = false; // dispersion returns on the settling frame
        paint();
        raf = t < 1 ? requestAnimationFrame(step) : 0;
      };
      raf = requestAnimationFrame(step);
    }

    const clamp = (v: number) => Math.min(W - 40, Math.max(W * 0.1, v));

    function onDown(e: PointerEvent) {
      if (!draggable || !ready) return;
      const x = e.clientX - host!.getBoundingClientRect().left;
      if (x < edge - 40) return;
      dragging = true;
      moving = true;
      grabOffset = x - edge;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      host!.setPointerCapture(e.pointerId);
      host!.style.cursor = "grabbing";
    }

    function onMove(e: PointerEvent) {
      if (!draggable || !ready) return;
      const x = e.clientX - host!.getBoundingClientRect().left;

      if (!dragging) {
        host!.style.cursor = x >= edge - 40 ? "grab" : "default";
        return;
      }
      edge = clamp(x - grabOffset);
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          paint();
        });
      }
    }

    function onUp(e: PointerEvent) {
      if (!dragging) return;
      dragging = false;
      moving = false;
      host!.releasePointerCapture?.(e.pointerId);
      host!.style.cursor = "grab";
      paint(); // redraw once at rest, with dispersion back on
    }

    img.decoding = "async";
    img.onload = () => {
      build();
      paint();
      if (entrance && !reduced) slideIn();
    };
    img.src = src;

    const ro = new ResizeObserver(() => {
      const ratio = W ? edge / W : from;
      build();
      edge = clamp(ratio * W);
      paint();
    });
    ro.observe(host);

    if (draggable) {
      host.addEventListener("pointerdown", onDown);
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerup", onUp);
      host.addEventListener("pointercancel", onUp);
    }

    return () => {
      ro.disconnect();
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerup", onUp);
      host.removeEventListener("pointercancel", onUp);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [src, from, fluteWidth, strength, tone, entrance, draggable]);

  return <canvas ref={ref} aria-hidden className={className} />;
}
