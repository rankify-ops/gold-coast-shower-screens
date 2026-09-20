"use client";

import { useEffect, useSyncExternalStore } from "react";
import { PREVIEW_ENABLED, PREVIEW_ENDS, extensionMailto } from "@/content/preview";

/*
 * "Preview ended" gate, plus the countdown pill while a deadline is still ahead.
 *
 * Client-only (null until mounted) so the static HTML never bakes in a time.
 * The blur is applied before first paint by the inline script in layout.tsx;
 * this keeps the class in sync and draws the gate or the pill.
 */
const END = Date.parse(PREVIEW_ENDS);

const subscribeClock = (onChange: () => void) => {
  const id = window.setInterval(onChange, 1000);
  return () => window.clearInterval(id);
};
const readClock = () => Math.floor(Date.now() / 1000) * 1000;
const noSubscribe = () => () => {};
const readForced = () => new URLSearchParams(window.location.search).get("preview") === "expired";

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 7 8.5-7" />
    </svg>
  );
}

export function PreviewGate() {
  const now = useSyncExternalStore<number | null>(subscribeClock, readClock, () => null);
  const forced = useSyncExternalStore(noSubscribe, readForced, () => false);
  const expired = now !== null && (forced || now >= END);

  // Tied to PREVIEW_ENABLED as well: with the gate off, the blur class must
  // never be applied — otherwise the page blurs with nothing on top of it.
  useEffect(() => {
    document.documentElement.classList.toggle("preview-expired", PREVIEW_ENABLED && expired);
  }, [expired]);

  if (!PREVIEW_ENABLED || now === null) return null;

  if (expired) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-gate-title"
        className="preview-gate fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(0,26,43,0.42)] p-5"
      >
        <div className="w-full max-w-[460px] rounded-[20px] bg-white p-8 text-center shadow-[0_30px_80px_rgba(0,26,43,0.35)] sm:p-10">
          <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-[rgba(0,38,61,0.07)] text-[#00263d]">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          </div>
          <div className="mb-2 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-[#a59f89]">Preview ended</div>
          <h2 id="preview-gate-title" className="text-[26px] font-semibold leading-tight tracking-[-0.02em] text-[#00263d]">
            This website preview has expired
          </h2>
          <p className="mx-auto mt-3 max-w-[340px] text-[15px] leading-relaxed text-[#4e5f6b]">
            Need more time to review? Request an extension and we&rsquo;ll switch it back on for you.
          </p>
          <a
            href={extensionMailto("expired")}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#00263d] px-6 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-[#0a3b58]"
          >
            <MailIcon />
            Request an extension
          </a>
          <p className="mt-4 text-[12.5px] text-[#7b8891]">Opens an email to the Rankify team</p>
        </div>
      </div>
    );
  }

  const left = Math.max(0, END - now);
  const h = Math.floor(left / 3_600_000);
  const m = Math.floor((left % 3_600_000) / 60_000);
  const s = Math.floor((left % 60_000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      role="status"
      aria-label={`Website preview ending in ${h} hours ${m} minutes`}
      className="preview-pill fixed inset-x-3.5 bottom-[84px] z-[900] flex items-center gap-3 rounded-full py-2 pl-4 pr-2 text-white lg:inset-x-auto lg:bottom-5 lg:left-5"
    >
      <span className="h-2 w-2 shrink-0 rounded-full bg-[#36b4e6]" />
      <span className="min-w-0 flex-1 text-[12.5px] font-medium leading-tight lg:flex-none">
        <span className="hidden sm:inline">Website preview ending in </span>
        <span className="sm:hidden">Preview ends in </span>
        <span className="font-semibold tabular-nums tracking-wide">
          {pad(h)}:{pad(m)}:{pad(s)}
        </span>
      </span>
      <a
        href={extensionMailto("active")}
        className="shrink-0 rounded-full bg-white px-3.5 py-2 text-[12.5px] font-semibold text-[#00263d] transition-colors hover:bg-[#36b4e6] hover:text-white"
      >
        Request extension
      </a>
    </div>
  );
}
