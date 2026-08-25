"use client";

import { useEffect, useRef } from "react";

export type GlassMode = "still" | "steam" | "wipe" | "drip";

/* Still leads, and is therefore the default: frosted glass that just sits
   there. Nothing responds to the pointer until someone chooses an effect, so
   the hero does not ask to be played with before it has been read. The three
   interactive modes are still one arrow away. */
export const GLASS_MODES: { id: GlassMode; label: string }[] = [
  { id: "still", label: "Frosted" },
  { id: "steam", label: "Steam" },
  { id: "wipe", label: "Squeegee" },
  { id: "drip", label: "Run-off" },
];

/** Whether a mode responds to the pointer at all. */
export function isInteractive(mode: GlassMode) {
  return mode !== "still";
}

/**
 * Frosted glass with three behaviours.
 *
 *   still  frosted and inert — the default, ignores the pointer
 *   steam  clears like the squeegee, then fogs back in
 *   wipe   dragging clears the frost, and it stays clear
 *   drip   droplets run down, each clearing a trail behind it
 *
 * ARCHITECTURE
 * Three canvases:
 *   frost  offscreen, the blurred photograph — drawn once per resize
 *   wipe   offscreen alpha mask of everything currently cleared
 *   view   what you see: frost, with wipe punched out of it
 *
 * Pre-rendering the blur is what makes the animated modes affordable. A
 * `blur(18px)` drawImage costs several milliseconds; doing it every frame at
 * 60fps would eat the budget on its own. Rendering it once and compositing two
 * flat blits per frame costs almost nothing, so steam and drip can run
 * continuously.
 *
 * Pointer wiping works in every mode — you can rub a hole in the steam, or
 * help the run-off along.
 */
export function GlassEffects({
  src,
  coverOf,
  mode,
  blur = 18,
  tint = "rgba(4,10,16,0.42)",
  radius = 62,
}: {
  src: string;
  /** The element the photograph is object-cover'd against — the hero section. */
  coverOf: React.RefObject<HTMLElement | null>;
  mode: GlassMode;
  blur?: number;
  tint?: string;
  radius?: number;
}) {
  const viewRef = useRef<HTMLCanvasElement>(null);
  // Read inside the loop so switching mode does not tear down the animation.
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    const view = viewRef.current;
    const host = view?.parentElement;
    const section = coverOf.current;
    if (!view || !host || !section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const frost = document.createElement("canvas");
    const wipe = document.createElement("canvas");
    const img = new Image();

    let raf = 0;
    let dpr = 1;
    let ready = false;
    let last = 0;
    let lastPoint: { x: number; y: number } | null = null;
    let prevMode: GlassMode = modeRef.current;
    let drops: { x: number; y: number; vy: number; r: number; drift: number }[] = [];

    const W = () => view.width / dpr;
    const H = () => view.height / dpr;

    /** The object-cover transform of the photo over `section`, in panel space. */
    function coverRect() {
      const s = section!.getBoundingClientRect();
      const p = host!.getBoundingClientRect();
      const scale = Math.max(s.width / img.naturalWidth, s.height / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      return {
        x: (s.width - dw) / 2 - (p.left - s.left),
        y: (s.height - dh) / 2 - (p.top - s.top),
        dw,
        dh,
      };
    }

    /** Redraw the blurred plate. Only on load and resize. */
    function renderFrost() {
      const ctx = frost.getContext("2d");
      if (!ctx || !img.naturalWidth) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, frost.width, frost.height);
      ctx.save();
      ctx.scale(dpr, dpr);
      const r = coverRect();
      ctx.filter = `blur(${blur}px)`;
      ctx.drawImage(img, r.x, r.y, r.dw, r.dh);
      ctx.filter = "none";
      ctx.fillStyle = tint;
      ctx.fillRect(0, 0, W(), H());
      ctx.restore();
    }

    function resize() {
      const rect = host!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (const c of [view!, frost, wipe]) {
        c.width = Math.max(1, Math.round(rect.width * dpr));
        c.height = Math.max(1, Math.round(rect.height * dpr));
      }
      view!.style.width = `${rect.width}px`;
      view!.style.height = `${rect.height}px`;
      renderFrost();
    }

    /** Add cleared area to the mask. */
    function clearDab(x: number, y: number, rad: number, strength = 1) {
      const ctx = wipe.getContext("2d");
      if (!ctx) return;
      ctx.globalCompositeOperation = "source-over";
      const g = ctx.createRadialGradient(x * dpr, y * dpr, 0, x * dpr, y * dpr, rad * dpr);
      // Feathered — a hard circle reads as a hole punched in the glass rather
      // than something having passed over it.
      g.addColorStop(0, `rgba(0,0,0,${strength})`);
      g.addColorStop(0.55, `rgba(0,0,0,${strength * 0.9})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x * dpr, y * dpr, rad * dpr, 0, Math.PI * 2);
      ctx.fill();
    }

    /** Take cleared area away again — this is what makes glass re-fog. */
    function refog(amount: number) {
      const ctx = wipe.getContext("2d");
      if (!ctx) return;
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0,0,0,${amount})`;
      ctx.fillRect(0, 0, wipe.width, wipe.height);
      ctx.globalCompositeOperation = "source-over";
    }

    function stroke(x: number, y: number) {
      const prev = lastPoint;
      lastPoint = { x, y };
      if (!prev) {
        clearDab(x, y, radius);
        return;
      }
      // Step along the segment so a quick flick leaves a line, not dots.
      const dist = Math.hypot(x - prev.x, y - prev.y);
      const steps = Math.min(48, Math.max(1, Math.ceil(dist / (radius * 0.34))));
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        clearDab(prev.x + (x - prev.x) * t, prev.y + (y - prev.y) * t, radius);
      }
    }

    function stepDrops(dt: number) {
      const w = W();
      const h = H();

      // Spawn rate is per-second, scaled by width so a wide panel gets
      // proportionally more drops rather than a sparser scatter.
      if (drops.length < 26 && Math.random() < dt * (w / 420)) {
        drops.push({
          x: Math.random() * w,
          y: -12,
          vy: 55 + Math.random() * 150,
          r: 3.5 + Math.random() * 7,
          drift: (Math.random() - 0.5) * 14,
        });
      }

      for (const d of drops) {
        const prevY = d.y;
        d.y += d.vy * dt;
        // Real run-off meanders as it picks up and sheds water.
        d.x += Math.sin(d.y * 0.035) * d.drift * dt;

        // Trail: narrower than the head, so it reads as a channel the droplet
        // has cleared rather than a wide smear.
        const trailR = d.r * 0.5;
        const span = Math.max(1, Math.ceil((d.y - prevY) / (trailR * 0.7)));
        for (let i = 0; i <= span; i++) {
          const t = i / span;
          clearDab(d.x, prevY + (d.y - prevY) * t, trailR, 0.85);
        }
        clearDab(d.x, d.y, d.r, 1);
      }

      drops = drops.filter((d) => d.y < h + 24);
    }

    function stepSteam(dt: number) {
      // Uniform creep, so any cleared patch closes over slowly wherever it is.
      //
      // 0.16/sec: a fully cleared streak is visibly healing within about a
      // second and gone by roughly ten. Faster than this and it snaps shut
      // before you have finished the stroke, which reads as the wipe failing
      // rather than as glass fogging.
      refog(dt * 0.16);

      // Plus occasional soft patches, so it fogs unevenly the way a real screen
      // does rather than dimming like a slider.
      if (Math.random() < dt * 2.2) {
        const ctx = wipe.getContext("2d");
        if (ctx) {
          const x = Math.random() * W();
          const y = Math.random() * H();
          const rad = 40 + Math.random() * 90;
          ctx.globalCompositeOperation = "destination-out";
          const g = ctx.createRadialGradient(x * dpr, y * dpr, 0, x * dpr, y * dpr, rad * dpr);
          g.addColorStop(0, "rgba(0,0,0,0.16)");
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, wipe.width, wipe.height);
          ctx.globalCompositeOperation = "source-over";
        }
      }
    }

    function composite() {
      const ctx = view!.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, view!.width, view!.height);
      ctx.drawImage(frost, 0, 0);
      ctx.globalCompositeOperation = "destination-out";
      ctx.drawImage(wipe, 0, 0);
      ctx.globalCompositeOperation = "source-over";
    }

    function tick(now: number) {
      raf = requestAnimationFrame(tick);
      if (!ready) return;

      // Clamped so a backgrounded tab does not resume with one enormous step
      // that dumps every drop off the bottom at once.
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;

      const m = modeRef.current;

      // Switching back to still wipes the slate: anything cleared under a
      // previous effect would otherwise stay punched out of a plate that no
      // longer has any way to heal it.
      if (m === "still" && prevMode !== "still") {
        wipe.getContext("2d")?.clearRect(0, 0, wipe.width, wipe.height);
        drops = [];
        lastPoint = null;
      }
      prevMode = m;

      if (!reduced) {
        if (m === "steam") stepSteam(dt);
        if (m === "drip") stepDrops(dt);
      }
      composite();
    }

    function onMove(e: PointerEvent) {
      if (modeRef.current === "still") return;
      const rect = host!.getBoundingClientRect();
      stroke(e.clientX - rect.left, e.clientY - rect.top);
    }
    const onLeave = () => {
      lastPoint = null;
    };

    img.decoding = "async";
    img.onload = () => {
      ready = true;
      resize();
      last = performance.now();
    };
    img.src = src;

    const ro = new ResizeObserver(() => {
      // Cleared area is in device pixels, so it no longer lines up after a
      // resize. Wiping from scratch is less jarring than a smeared mask.
      const ctx = wipe.getContext("2d");
      ctx?.clearRect(0, 0, wipe.width, wipe.height);
      drops = [];
      resize();
    });
    ro.observe(host);

    if (canHover) {
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
    }

    raf = requestAnimationFrame(tick);

    return () => {
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [src, coverOf, blur, tint, radius]);

  return (
    <canvas
      ref={viewRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
