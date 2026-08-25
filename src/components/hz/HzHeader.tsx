"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { NAV, SITE } from "@/content/site";
import { asset } from "@/lib/basePath";
import { SmartLink } from "@/components/ui/SmartLink";

/**
 * The /refresh header.
 *
 * Follows the reference exactly in structure: MENU at the far left, the
 * wordmark beside it, the local time dead centre, and a black CTA bar with a
 * coral square on the right. No nav links across the top at all — the nav
 * lives behind MENU, which is what buys the centre of the bar for the clock
 * and keeps the top of a dark hero almost empty.
 *
 * The clock is real and ticks. It renders empty on the server and fills in on
 * mount, because a server-rendered time is wrong the moment it is cached — and
 * this is a static export.
 */
export function HzHeader() {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-AU", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: "Australia/Brisbane",
        }).format(new Date())
      );
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 hz-pad py-4 lg:py-5">
      <div className="flex items-center justify-between gap-6">
        <div className="pointer-events-auto flex items-center gap-6">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="hz-mono flex items-center gap-2.5 text-white"
          >
            <span className="flex h-3 w-3 flex-col justify-between">
              <span
                className={`h-px w-full bg-current transition-transform duration-500 ${
                  open ? "translate-y-[5px] rotate-45" : ""
                }`}
              />
              <span className={`h-px w-full bg-current transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
              <span
                className={`h-px w-full bg-current transition-transform duration-500 ${
                  open ? "-translate-y-[5px] -rotate-45" : ""
                }`}
              />
            </span>
            {open ? "Close" : "Menu"}
          </button>

          <SmartLink href="#top" aria-label={SITE.name} className="pointer-events-auto">
            <Image
              src={asset("/img/logos/Gold-Coast-Screens-Logo-White-Taupe.svg")}
              alt={SITE.name}
              width={200}
              height={39}
              priority
              className="h-[22px] w-auto"
            />
          </SmartLink>
        </div>

        {/* Centre: local time, exactly as the reference runs it. */}
        <p className="hz-mono pointer-events-auto hidden text-white/60 lg:block">
          <span className="text-white">{time || " "}</span>
          <span className="ml-3">Gold Coast</span>
        </p>

        {/* Right: the CTA bar. */}
        <a
          href={SITE.phoneHref}
          className="hz-btn pointer-events-auto group border-transparent"
        >
          <span className="hz-mono">
            Call now
            <span className="opacity-45">{SITE.phone}</span>
          </span>
          <span aria-hidden>
            <svg viewBox="0 0 10 10" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 5h6M5.4 2.2 8.2 5l-2.8 2.8" />
            </svg>
          </span>
        </a>
      </div>

      {/* Full-screen menu */}
      <div
        className={`pointer-events-auto fixed inset-0 -z-10 bg-[#121212] transition-opacity duration-500 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="flex h-full flex-col justify-center gap-2 hz-pad">
          {NAV.map((item, i) => (
            <SmartLink
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="hz-dsp hz-dsp-lg group flex items-baseline gap-6 border-b border-white/10 py-5 text-white transition-colors duration-500 hover:text-[color:var(--hz-accent)]"
            >
              <span className="hz-mono text-white/40">/0{i + 1}</span>
              {item.label}
            </SmartLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
