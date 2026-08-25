"use client";

import { useState } from "react";
import Image from "next/image";
import { GALLERY } from "@/content/site";
import { asset } from "@/lib/basePath";
import { SmartLink } from "@/components/ui/SmartLink";
import { Arrow } from "@/components/ui/Arrow";

/**
 * Recent work, as a mosaic that reacts to the pointer.
 *
 * v1 pins the section and drags a filmstrip sideways. This one holds still and
 * lets the grid breathe instead: hovering a plate lifts it and desaturates
 * every other one, so attention is directed without anything moving on the
 * page. On a light ground that reads calmer than motion, and it costs no
 * scroll-jacking.
 *
 * Cells are deliberately unequal — two tall, one wide, the rest square — so
 * nine photographs of similar subject matter do not read as a contact sheet.
 * The spans are declared per index rather than derived, because the rhythm was
 * chosen by eye against these particular nine images.
 */
const SPANS = [
  "sm:col-span-2 sm:row-span-2",
  "",
  "",
  "sm:row-span-2",
  "",
  "sm:col-span-2",
  "",
  "",
  "sm:col-span-2",
];

export function MosaicGallery() {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <section id="gallery" className="relative bg-paper">
      <div className="layer px-6 py-24 lg:px-12 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-[color:var(--ink-38)]">
              Recent work
            </p>
            <h2 className="mt-6 max-w-[15ch] text-[clamp(30px,4vw,60px)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">
              Ten thousand screens. No two identical.
            </h2>
          </div>
          <SmartLink
            href="#configurator"
            className="flex items-center gap-2.5 rounded-full border border-[color:var(--rule-dark)] px-6 py-3.5 text-[13px] font-medium text-ink transition-colors duration-300 hover:bg-mist"
          >
            Get a price
            <Arrow />
          </SmartLink>
        </div>

        <div
          className="mt-16 grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[200px] sm:grid-cols-4 lg:auto-rows-[220px]"
          onMouseLeave={() => setHover(null)}
        >
          {GALLERY.map((item, i) => {
            const dim = hover !== null && hover !== i;
            return (
              <figure
                key={item.name}
                onMouseEnter={() => setHover(i)}
                className={`group relative overflow-hidden rounded-[20px] bg-mist transition-all duration-500 ${SPANS[i]}`}
                style={{
                  transform: hover === i ? "translateY(-6px)" : "none",
                  filter: dim ? "saturate(0.35)" : "none",
                  opacity: dim ? 0.7 : 1,
                }}
              >
                <Image
                  src={asset(item.image)}
                  alt={`${item.name}, ${item.finish}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-[1.4s] group-hover:scale-[1.05]"
                />

                {/* Caption arrives on hover rather than sitting on every plate —
                    nine permanent captions would compete with the images. */}
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-3 bg-[linear-gradient(to_top,rgba(0,26,43,0.86),transparent)] p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-[13px] font-semibold tracking-[-0.01em] text-white">
                    {item.name}
                  </p>
                  <p className="mt-1 text-[12px] font-medium uppercase tracking-[0.06em] text-white/60">
                    {item.finish}
                  </p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
