"use client";

import { useState } from "react";
import Image from "next/image";
import { GALLERY } from "@/content/site";
import { asset } from "@/lib/basePath";
import { Label, Rise } from "@/components/hz/Bits";

/**
 * 02 — Recent work.
 *
 * The reference's project section: full-bleed plates stacked one per row, each
 * with the meta set across the top of the image and a bar button pinned to its
 * lower-left corner. Nothing is cropped into a card — the photograph runs edge
 * to edge and the furniture sits on top of it.
 *
 * Alternating tall and short rows so nine images of the same subject do not
 * read as a contact sheet, and the hovered plate lifts its overlay away so the
 * photograph is briefly unobstructed.
 */
export function HzWork() {
  const [open, setOpen] = useState<number | null>(null);
  const rows = GALLERY.slice(0, 6);

  return (
    <section id="gallery" className="hz-dark hz-grid relative">
      {/* Label in column 1, heading from column 2 — measured, they share a
          baseline on the reference rather than stacking. */}
      <div className="hz-head hz-pad pt-[var(--hz-section)]">
        <Label n="02">Recent work</Label>

        <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-8">
          <Rise>
            <h2 className="hz-dsp hz-dsp-lg max-w-[14ch]">
              Ten thousand screens.
              <br />
              <span className="hz-dim">No two identical.</span>
            </h2>
          </Rise>
          <Rise delay={90}>
            <p className="hz-body max-w-[30ch] text-[color:var(--hz-muted)]">
              Every one templated on site and made at our own factory.
            </p>
          </Rise>
        </div>
      </div>

      <div className="mt-[var(--hz-gap)] grid hz-pad gap-3 pb-[var(--hz-section)] lg:grid-cols-2 lg:gap-4">
        {rows.map((item, i) => {
          // Every third plate runs full width, so the rhythm never settles.
          const wide = i % 3 === 0;
          return (
            <Rise
              key={item.name}
              delay={(i % 2) * 80}
              className={wide ? "lg:col-span-2" : ""}
            >
              <article
                onMouseEnter={() => setOpen(i)}
                onMouseLeave={() => setOpen(null)}
                className={`group relative w-full overflow-hidden bg-white/5 ${
                  wide ? "aspect-[16/9]" : "aspect-[4/3]"
                }`}
              >
                <Image
                  src={asset(item.image)}
                  alt={`${item.name}, ${item.finish}`}
                  fill
                  sizes={wide ? "100vw" : "50vw"}
                  className="object-cover transition-transform duration-[1.6s] group-hover:scale-[1.04]"
                />

                <div
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(18,18,18,0.72),transparent_38%,rgba(18,18,18,0.55))] transition-opacity duration-700 group-hover:opacity-70"
                />

                {/* Meta across the top */}
                <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-6 p-5 lg:p-7">
                  <p className="hz-mono text-white">
                    <span className="text-[color:var(--hz-accent)]">
                      /{String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="ml-4">{item.name}</span>
                  </p>
                  <p className="hz-mono-sm text-right text-white/60">{item.finish}</p>
                </div>

                {/* Bar button, lower left, arriving on hover */}
                <div
                  className={`absolute bottom-0 left-0 flex transition-all duration-500 ${
                    open === i ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                  }`}
                >
                  <span className="hz-mono flex items-center gap-2 bg-[#121212] px-5 py-3.5 text-white">
                    View detail
                    <span className="opacity-45">{item.finish}</span>
                  </span>
                  <span className="flex w-11 items-center justify-center bg-[color:var(--hz-accent)] text-[#121212]">
                    <svg viewBox="0 0 10 10" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 5h6M5.4 2.2 8.2 5l-2.8 2.8" />
                    </svg>
                  </span>
                </div>
              </article>
            </Rise>
          );
        })}
      </div>
    </section>
  );
}
