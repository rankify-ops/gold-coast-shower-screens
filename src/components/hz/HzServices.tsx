"use client";

import { useState } from "react";
import Image from "next/image";
import { PRODUCTS } from "@/content/site";
import { asset } from "@/lib/basePath";
import { Label, Rise, BarButton } from "@/components/hz/Bits";

/**
 * 03 — What we make.
 *
 * The reference's services list: full-width rows, a mono number, the name in
 * display type, and a plus that opens the detail. Rows rather than cards,
 * because four cards side by side make you choose one before you have read any
 * of them, and a list is read top to bottom without deciding anything.
 *
 * The open row reveals its photograph alongside the copy. Height animates on
 * grid-template-rows, so the row grows to exactly its content with no measured
 * max-height to get wrong when the copy changes.
 */
export function HzServices() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="products" className="hz-dark hz-grid relative border-t border-white/12">
      <div className="hz-head hz-pad pt-[var(--hz-section)]">
        <Label n="03">What we make</Label>

        <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-8">
          <Rise>
            <h2 className="hz-dsp hz-dsp-lg max-w-[13ch]">
              Four things.
              <br />
              <span className="hz-dim">All of them glass.</span>
            </h2>
          </Rise>
          <Rise delay={90}>
            <BarButton note="/Free" href="#configurator">
              Price any of them
            </BarButton>
          </Rise>
        </div>
      </div>

      <div className="mt-[var(--hz-gap)] border-t border-white/12 pb-[var(--hz-section)]">
        {PRODUCTS.map((p, i) => {
          const isOpen = open === i;
          return (
            <div key={p.name} className="border-b border-white/12">
              <button
                type="button"
                aria-expanded={isOpen}
                onMouseEnter={() => setOpen(i)}
                onFocus={() => setOpen(i)}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center gap-6 hz-pad py-8 text-left lg:gap-12 lg:py-10"
              >
                <span
                  className={`hz-mono flex-none transition-colors duration-500 ${
                    isOpen ? "text-[color:var(--hz-accent)]" : "text-white/40"
                  }`}
                >
                  {p.index}
                </span>

                <span className="hz-dsp hz-dsp-md flex-1 transition-colors duration-500">
                  {p.name}
                </span>

                <span className="hz-mono hidden text-white/40 lg:block">
                  {p.specs[0].value}
                </span>

                {/* Plus that becomes a minus. */}
                <span className="relative h-4 w-4 flex-none">
                  <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-white" />
                  <span
                    className={`absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-white transition-transform duration-500 ${
                      isOpen ? "scale-y-0" : "scale-y-100"
                    }`}
                  />
                </span>
              </button>

              <div
                className="grid transition-[grid-template-rows] duration-700"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <div className="grid gap-8 hz-pad pb-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:pb-14 lg:pl-[calc(var(--hz-gutter)+7rem)]">
                    <div>
                      <p className="hz-body max-w-[44ch] text-[color:var(--hz-muted)]">{p.line}</p>

                      <dl className="mt-8 border-t border-white/12">
                        {p.specs.map((sp) => (
                          <div
                            key={sp.label}
                            className="flex items-baseline justify-between gap-6 border-b border-white/12 py-3.5"
                          >
                            <dt className="hz-mono-sm text-white/40">{sp.label}</dt>
                            <dd className="hz-mono">{sp.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>

                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-white/5">
                      <Image
                        src={asset(p.image)}
                        alt={p.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
