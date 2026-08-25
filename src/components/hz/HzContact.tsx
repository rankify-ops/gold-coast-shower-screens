"use client";

import { useState } from "react";
import Image from "next/image";
import { FAQ, FOOTER_LINKS, SHOWROOM, SITE } from "@/content/site";
import { asset } from "@/lib/basePath";
import { SmartLink } from "@/components/ui/SmartLink";
import { Label, Rise, BarButton } from "@/components/hz/Bits";

/**
 * 06 — Questions, and 07 — Contact.
 *
 * Two blocks that close the page the way the reference does: a hairline FAQ
 * list, then a coral panel carrying the offer.
 *
 * The coral panel is the one moment of full accent on the page. It works
 * because it is the only one — the colour has been a 7px square and a hover
 * state for six sections, so a full field of it at the end reads as arrival
 * rather than decoration.
 */
export function HzContact() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      {/* 06 — FAQ */}
      <section id="faq" className="hz-dark hz-grid relative">
        <div className="hz-head hz-pad pt-[var(--hz-section)]">
          <Label n="06">Questions</Label>

          <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-8">
            <Rise>
              <h2 className="hz-dsp hz-dsp-lg max-w-[12ch]">
                Answered
                <br />
                <span className="hz-dim">before you ask.</span>
              </h2>
            </Rise>
            <Rise delay={90}>
              <a href={SITE.phoneHref} className="hz-mono text-white/55 transition-colors duration-500 hover:text-white">
                Not covered here? {SITE.phone}
              </a>
            </Rise>
          </div>
        </div>

        <div className="mt-[var(--hz-gap)] border-t border-white/12 pb-[var(--hz-section)]">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="border-b border-white/12">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-start gap-6 hz-pad py-7 text-left lg:gap-12"
                >
                  <span
                    className={`hz-mono mt-1 flex-none transition-colors duration-500 ${
                      isOpen ? "text-[color:var(--hz-accent)]" : "text-white/40"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="hz-body flex-1 text-[clamp(15px,1.5vw,22px)]">{item.q}</span>
                  <span className="relative mt-1 h-4 w-4 flex-none">
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
                    <p className="hz-body max-w-[62ch] hz-pad pb-8 text-[color:var(--hz-muted)] lg:pl-[calc(var(--hz-gutter)+5.6rem)]">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 07 — Contact */}
      <footer id="contact" className="hz-grid relative border-t border-[color:var(--hz-line)]">
        <div className="hz-head hz-pad hz-sec">
          <Label n="07">Get in touch</Label>

          <div>
          <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
            {/* The coral panel */}
            <Rise>
              <div className="flex h-full flex-col justify-between gap-14 bg-[color:var(--hz-accent)] p-8 text-[#121212] lg:p-12">
                <div>
                  <p className="hz-mono">Free measure &amp; quote</p>
                  <h2 className="hz-dsp hz-dsp-lg mt-10 max-w-[13ch]">
                    Let&rsquo;s measure
                    <br />
                    your bathroom.
                  </h2>
                </div>

                <div>
                  <ul className="hz-mono flex flex-wrap gap-x-8 gap-y-3">
                    {["No obligation", "No deposit for a price", "3D diagram with every quote"].map((t) => (
                      <li key={t} className="flex items-center gap-2.5">
                        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M2 6.4 4.6 9 10 3.2" />
                        </svg>
                        {t}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-10 flex">
                    <SmartLink href="#configurator" className="hz-mono flex items-center gap-2 bg-[#121212] px-6 py-4 text-white">
                      Get an instant estimate
                      <span className="opacity-45">/Free</span>
                    </SmartLink>
                    <span className="flex w-12 items-center justify-center bg-white text-[#121212]">
                      <svg viewBox="0 0 10 10" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2 5h6M5.4 2.2 8.2 5l-2.8 2.8" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Rise>

            {/* Showroom */}
            <Rise delay={110}>
              <div className="flex h-full flex-col">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[color:var(--hz-line)]">
                  <Image
                    src={asset("/img/site/showroom.webp")}
                    alt="The Gold Coast Shower Screens showroom at Coombabah"
                    fill
                    sizes="(max-width: 1024px) 100vw, 35vw"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between gap-8 border border-t-0 border-[color:var(--hz-line)] p-7">
                  <div>
                    <p className="hz-mono text-[color:var(--hz-muted)]">{SHOWROOM.eyebrow}</p>
                    <p className="hz-body mt-5">{SITE.address}</p>
                    <p className="hz-mono-sm mt-3 text-[color:var(--hz-muted)]">
                      Mon&ndash;Fri, 8am&ndash;4pm
                    </p>
                  </div>
                  <BarButton href={SITE.phoneHref} note={SITE.phone}>
                    Call
                  </BarButton>
                </div>
              </div>
            </Rise>
          </div>

          {/* Directory */}
          <div className="mt-20 grid gap-12 border-t border-[color:var(--hz-line)] pt-14 lg:grid-cols-[1.4fr_repeat(2,minmax(0,1fr))]">
            <div>
              <Image
                src={asset("/img/logos/Gold-Coast-Screens-Logo-1.svg")}
                alt={SITE.name}
                width={200}
                height={39}
                className="h-7 w-auto"
              />
              <a
                href={SITE.phoneHref}
                className="hz-dsp hz-dsp-md mt-8 block transition-colors duration-500 hover:text-[color:var(--hz-accent)]"
              >
                {SITE.phone}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="hz-mono mt-4 block text-[color:var(--hz-muted)] transition-colors duration-500 hover:text-[color:var(--hz-ink)]"
              >
                {SITE.email}
              </a>
            </div>

            {FOOTER_LINKS.map((col) => (
              <nav key={col.title}>
                <p className="hz-mono-sm text-[color:var(--hz-muted)]">{col.title}</p>
                <ul className="mt-6 flex flex-col gap-2.5">
                  {col.items.map((item) => (
                    <li key={item}>
                      <a
                        href="#top"
                        className="hz-mono text-[color:var(--hz-ink)] opacity-60 transition-opacity duration-300 hover:opacity-100"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="hz-mono-sm mt-[var(--hz-gap)] flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--hz-line)] pt-6 text-[color:var(--hz-muted)]">
            <span>
              &copy; {new Date().getFullYear()} {SITE.name} — {SITE.licence}
            </span>
            <span className="flex gap-6">
              <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            </span>
          </div>
          </div>
        </div>
      </footer>
    </>
  );
}
