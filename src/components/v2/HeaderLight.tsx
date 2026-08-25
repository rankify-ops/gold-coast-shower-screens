"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SmartLink } from "@/components/ui/SmartLink";
import { Arrow } from "@/components/ui/Arrow";
import { MEGA_PRODUCTS, NAV, SITE } from "@/content/site";
import { asset } from "@/lib/basePath";

/**
 * The light header.
 *
 * v1's bar is transparent over a dark hero and hardens to near-black on
 * scroll. This one never goes dark: it floats as a pill on paper and gains a
 * frosted white fill once you leave the hero, so the page reads light from the
 * first pixel to the last.
 *
 * Two structural rules carried over from the dark header, because neither is a
 * style decision:
 *   - the frost sits on a SIBLING of the mega menu, never an ancestor, or the
 *     menu's own backdrop-blur has nothing left to sample;
 *   - closing is deferred and owned by the <header>, so travelling from the nav
 *     down into the panel does not shut it mid-crossing.
 */
export function HeaderLight() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMega = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setMega(true);
  }, []);

  const closeMega = useCallback((delay = 180) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMega(false), delay);
  }, []);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setSolid(window.scrollY > 40);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      onMouseLeave={() => closeMega(0)}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 lg:px-6 lg:pt-5"
    >
      <div className="relative mx-auto max-w-[1500px]">
        <div
          aria-hidden
          className={`absolute inset-0 rounded-full border transition-all duration-500 ${
            solid
              ? "border-[color:var(--rule-dark)] bg-white/75 shadow-[0_10px_40px_-24px_rgba(0,38,62,0.5)] backdrop-blur-xl"
              : "border-transparent"
          }`}
        />

        <div className="relative flex items-center justify-between gap-6 py-3 pl-5 pr-3 lg:pl-7 lg:pr-4">
          <SmartLink href="#top" aria-label={SITE.name} className="flex-none">
            <Image
              src={asset("/img/logos/Gold-Coast-Screens-Logo-1.svg")}
              alt={SITE.name}
              width={200}
              height={39}
              priority
              className="h-[26px] w-auto lg:h-[30px]"
            />
          </SmartLink>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => {
              const isProducts = item.href === "#products";
              return (
                <SmartLink
                  key={item.label}
                  href={item.href}
                  onMouseEnter={() => (isProducts ? openMega() : closeMega(0))}
                  onFocus={() => (isProducts ? openMega() : closeMega(0))}
                  aria-expanded={isProducts ? mega : undefined}
                  className={`rounded-full px-4 py-2 text-[13px] font-medium tracking-[-0.01em] transition-colors duration-300 ${
                    isProducts && mega
                      ? "bg-navy text-white"
                      : "text-[color:var(--ink-60)] hover:bg-mist hover:text-ink"
                  }`}
                >
                  {item.label}
                </SmartLink>
              );
            })}
          </nav>

          <div className="flex flex-none items-center gap-2">
            <a
              href={SITE.phoneHref}
              className="hidden rounded-full px-4 py-2 text-[13px] font-medium text-[color:var(--ink-60)] transition-colors duration-300 hover:text-ink sm:block"
            >
              {SITE.phone}
            </a>

            <SmartLink
              href="#configurator"
              className="flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-[13px] font-medium text-white transition-colors duration-300 hover:bg-[color:var(--navy-lift)]"
            >
              Get a price
              <Arrow />
            </SmartLink>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={open}
              className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full border border-[color:var(--rule-dark)] lg:hidden"
            >
              <span
                className={`h-px w-4 bg-ink transition-all duration-300 ${
                  open ? "translate-y-[3px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-px w-4 bg-ink transition-all duration-300 ${
                  open ? "-translate-y-[3px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>

        <div
          onMouseEnter={openMega}
          className={`absolute inset-x-0 top-full hidden pt-3 transition-[transform,visibility] duration-200 lg:block ${
            mega ? "visible translate-y-0" : "invisible -translate-y-2"
          }`}
          aria-hidden={!mega}
        >
          <div className="grid grid-cols-4 gap-3 rounded-3xl border border-[color:var(--rule-dark)] bg-white/85 p-3 shadow-[0_30px_70px_-30px_rgba(0,38,62,0.45)] backdrop-blur-2xl">
            {MEGA_PRODUCTS.map((col) => (
              <div key={col.title} className="rounded-2xl bg-mist/70 p-5">
                <SmartLink
                  href={col.href}
                  tabIndex={mega ? undefined : -1}
                  className="group flex items-center gap-3"
                >
                  <span
                    aria-hidden
                    style={{
                      maskImage: `url(${asset(col.icon)})`,
                      WebkitMaskImage: `url(${asset(col.icon)})`,
                      maskRepeat: "no-repeat",
                      WebkitMaskRepeat: "no-repeat",
                      maskPosition: "center",
                      WebkitMaskPosition: "center",
                      maskSize: "contain",
                      WebkitMaskSize: "contain",
                    }}
                    className="h-6 w-6 flex-none bg-navy transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
                    {col.title}
                  </span>
                </SmartLink>

                <ul className="mt-5 space-y-1">
                  {col.items.map((label) => (
                    <li key={label}>
                      <SmartLink
                        href={col.href}
                        tabIndex={mega ? undefined : -1}
                        className="group flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-[color:var(--ink-60)] transition-colors duration-300 hover:bg-white hover:text-ink"
                      >
                        <span>{label}</span>
                        <span className="text-brass opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <Arrow />
                        </span>
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 -z-10 bg-paper transition-opacity duration-500 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="flex h-full flex-col justify-center gap-2 px-8">
          {NAV.map((item, i) => (
            <SmartLink
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-5 border-b border-[color:var(--rule-dark)] py-5 text-[30px] font-semibold tracking-[-0.03em]"
            >
              <span className="text-[13px] text-brass">{String(i + 1).padStart(2, "0")}</span>
              {item.label}
            </SmartLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
