"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/content/site";

/**
 * Fixed rail across the bottom of the hero: lead time, licence, live clock.
 *
 * Real operational data is the cheapest way to look like a company that
 * measures things — it is the same reason the spec rows work.
 *
 * The clock renders empty until mounted. Formatting a time on the server and
 * again on the client guarantees a hydration mismatch, since the two run
 * seconds apart and in different timezones.
 */
export function StatusRail() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setNow(
        new Intl.DateTimeFormat("en-AU", {
          timeZone: "Australia/Brisbane",
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date())
      );

    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mi flex items-center justify-between gap-6 border-t border-[color:var(--rule)] px-6 py-4 text-[color:var(--w-32)] lg:px-12">
      <span className="flex items-center gap-3">
        Measure to install
        {/* Tally marks: filled for the weeks committed, hollow for the rest. */}
        <span aria-hidden className="flex items-center gap-[3px]">
          {Array.from({ length: 6 }, (_, i) => (
            <span
              key={i}
              className={`block h-[9px] w-[1.5px] ${i < 4 ? "bg-brass" : "bg-[color:var(--rule)]"}`}
            />
          ))}
        </span>
        <span className="text-[color:var(--w-90)]">14 working days</span>
      </span>

      <span className="hidden sm:block">
        QBCC <span className="text-[color:var(--w-90)]">{SITE.licence.replace("QBCC ", "")}</span>
      </span>

      <span>
        Gold Coast{" "}
        <span className="text-[color:var(--w-90)]">
          {/* Reserves the width so the rail does not reflow when the clock
              arrives after hydration. */}
          {now ?? " ".repeat(12)}
        </span>
      </span>
    </div>
  );
}
