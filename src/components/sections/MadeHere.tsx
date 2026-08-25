"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SITE } from "@/content/site";
import { asset } from "@/lib/basePath";

/**
 * Their own factory, full bleed, with the facts set over it.
 *
 * Every other claim on this page is made in type on a plain ground. This one is
 * made by showing the building and the vans parked outside it — "made right
 * here on the Gold Coast" is a sentence anyone can write, and a photograph of
 * the place is the part that cannot be faked.
 *
 * The image sits behind a slow parallax: it is rendered 130% tall and drifts
 * against the scroll, so the band has depth the flat sections around it do not.
 * Deliberately restrained — a few percent of travel, not a scroll-jacking
 * effect, because this section is a pause between two dense ones.
 */
export function MadeHere() {
  const ref = useRef<HTMLElement>(null);
  const [shift, setShift] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = el.getBoundingClientRect();
        // -1 when the section is just below the fold, +1 when just above it.
        const centred = (rect.top + rect.height / 2 - window.innerHeight / 2) /
          (window.innerHeight / 2 + rect.height / 2);
        setShift(Math.max(-1, Math.min(1, centred)));
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-navy on-dark">
      {/* 130% tall so there is headroom for the drift without ever exposing an
          edge at either end of the travel. */}
      <div
        aria-hidden
        className="absolute inset-x-0 -top-[15%] h-[130%]"
        style={{ transform: `translate3d(0, ${shift * 6}%, 0)` }}
      >
        <Image
          src={asset("/img/site/factory.webp")}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Two washes: a flat one to seat the type anywhere, and a heavier pool
          at the foot where the facts row sits. */}
      <div aria-hidden className="absolute inset-0 bg-navy/78" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_26_43/0.9),transparent_62%)]"
      />

      <div className="layer px-6 py-28 lg:px-12 lg:py-36">
        <p className="mi text-[color:var(--w-32)]">(06) &mdash; Made here</p>

        <h2 className="dsp mt-10 max-w-[14ch] text-[clamp(32px,5.4vw,86px)]">
          Built on the
          <br />
          <span className="text-brass">Gold Coast.</span>
        </h2>

        <p className="bd-sentence mt-10 max-w-[46ch] text-[color:var(--w-55)]">
          Not imported, not outsourced. Every screen, splashback, mirror and
          wardrobe door is manufactured in our own factory at Coombabah and
          installed by the people who made it.
        </p>

        <dl className="mt-20 grid gap-px border border-[color:var(--rule)] bg-[color:var(--rule)] sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: "Factory", v: "Coombabah, QLD" },
            { k: "Measure to install", v: "14 working days" },
            { k: "Servicing", v: "Gold Coast & Brisbane" },
            { k: "Licence", v: SITE.licence },
          ].map((row) => (
            <div key={row.k} className="bg-transparent px-5 py-7 backdrop-blur-[2px]">
              <dt className="mi text-[color:var(--w-32)]">{row.k}</dt>
              <dd className="mi mt-3 text-[color:var(--w-90)]">{row.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
