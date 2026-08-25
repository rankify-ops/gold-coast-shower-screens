"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ESTIMATOR,
  ESTIMATOR_START,
  ESTIMATOR_IMAGE_DIR,
  OPTION_IMAGE,
  PRODUCT_ICON,
  type EstimatorStep,
} from "@/content/estimator";
import { asset } from "@/lib/basePath";
import { SITE } from "@/content/site";
import { Arrow } from "@/components/ui/Arrow";

/**
 * The instant-estimate quiz, as a modal.
 *
 * Walks the question graph in src/content/estimator.ts — their own questions,
 * options and branching, lifted from the Zoho form they run today.
 *
 * This version does NOT email anything. It exists to show the flow and the
 * artwork; the summary at the end is the deliverable, and wiring it to a real
 * submission is a later job.
 *
 * A history stack drives Back rather than recomputing the path, because the
 * graph branches — from `showerHeight` there is no way to know whether you
 * arrived via hinged, sliding or doorless without remembering.
 */
export function EstimatorModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [path, setPath] = useState<string[]>([ESTIMATOR_START]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const currentId = path[path.length - 1];
  const step: EstimatorStep | undefined = ESTIMATOR[currentId];

  const reset = useCallback(() => {
    setPath([ESTIMATOR_START]);
    setAnswers({});
    setDone(false);
  }, []);

  // Escape closes; the page behind must not scroll while this is up.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // Start fresh each time it opens, rather than resuming a half-finished run
  // from a previous visit.
  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const answer = (value: string) => {
    if (!step) return;
    setAnswers((a) => ({ ...a, [step.id]: value }));

    const nxt = step.next;
    const target =
      typeof nxt === "string" ? nxt : nxt && typeof nxt === "object" ? nxt[value] : null;

    if (!target) setDone(true);
    else setPath((p) => [...p, target]);
  };

  const back = () => {
    if (done) {
      setDone(false);
      return;
    }
    if (path.length > 1) setPath((p) => p.slice(0, -1));
  };

  // Depth of the deepest branch, so the counter reads honestly rather than
  // claiming a fixed number of steps the user may never reach.
  const total = useMemo(() => Math.max(6, path.length + (done ? 0 : 1)), [path.length, done]);

  if (!open) return null;

  const summary = Object.entries(answers).map(([id, value]) => ({
    label: ESTIMATOR[id]?.question ?? id,
    value,
  }));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Instant estimate"
      className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6"
    >
      {/* Scrim. Clicking it closes — the same affordance as Escape. */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-navy/70 backdrop-blur-md"
      />

      <div className="relative flex max-h-[92svh] w-full max-w-[880px] flex-col border border-[color:var(--rule-dark)] bg-paper shadow-[0_30px_80px_-20px_rgba(0,38,62,0.5)]">
        {/* Header: progress, step counter, close */}
        <div className="flex items-center justify-between gap-6 border-b border-[color:var(--rule-dark)] px-6 py-4 sm:px-8">
          <p className="mi text-[color:var(--ink-38)]">
            Instant estimate
            <span className="mx-3 text-[color:var(--rule-dark)]">/</span>
            <span className="text-ink">
              {done ? "Summary" : `Step ${path.length} of ${total}`}
            </span>
          </p>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="relative h-4 w-4 flex-none"
          >
            <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 rotate-45 bg-ink" />
            <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 -rotate-45 bg-ink" />
          </button>
        </div>

        {/* Progress rule */}
        <div className="h-px w-full bg-[color:var(--rule-dark)]">
          <div
            className="h-px bg-navy transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ width: done ? "100%" : `${(path.length / total) * 100}%` }}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-8 sm:py-10">
          {done ? (
            <Summary rows={summary} />
          ) : step ? (
            <Step step={step} selected={answers[step.id]} onAnswer={answer} />
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 border-t border-[color:var(--rule-dark)] px-6 py-4 sm:px-8">
          <button
            type="button"
            onClick={back}
            disabled={path.length === 1 && !done}
            className="mi ln inline-flex items-center gap-2 text-[color:var(--ink-60)] disabled:pointer-events-none disabled:opacity-30"
          >
            <Arrow dir="left" />
            Back
          </button>

          {done ? (
            <div className="flex items-center gap-3">
              <button type="button" onClick={reset} className="mi btn">
                Start again
              </button>
              <a href={SITE.phoneHref} className="mi btn btn-solid">
                {SITE.phone}
              </a>
            </div>
          ) : (
            <p className="mi text-[color:var(--ink-38)]">Free measure &amp; quote</p>
          )}
        </div>
      </div>
    </div>
  );
}

/** One question. Choice steps render tiles, measure steps a number field. */
function Step({
  step,
  selected,
  onAnswer,
}: {
  step: EstimatorStep;
  selected?: string;
  onAnswer: (v: string) => void;
}) {
  const [value, setValue] = useState(selected ?? "");

  if (step.kind === "measure") {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim()) onAnswer(`${value.trim()}${step.unit ?? ""}`);
        }}
      >
        <h2 className="dsp-sm max-w-[22ch] text-[clamp(20px,2.6vw,32px)]">{step.question}</h2>
        <p className="mi mt-4 text-[color:var(--ink-38)]">
          Rough is fine — we measure on site before anything is made.
        </p>

        <div className="mt-8 flex max-w-[360px] items-center border border-[color:var(--rule-dark)]">
          <input
            autoFocus
            type="number"
            inputMode="numeric"
            min={100}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="0"
            className="mi w-full bg-transparent px-5 py-4 outline-none"
          />
          <span className="mi border-l border-[color:var(--rule-dark)] px-5 py-4 text-[color:var(--ink-38)]">
            {step.unit}
          </span>
        </div>

        <button type="submit" className="mi btn btn-solid mt-8" disabled={!value.trim()}>
          Continue
          <Arrow />
        </button>
      </form>
    );
  }

  const isProduct = step.id === "product";
  const isSize = step.kind === "size";

  return (
    <div>
      <h2 className="dsp-sm max-w-[24ch] text-[clamp(20px,2.6vw,32px)]">{step.question}</h2>

      <div
        className={`mt-8 grid gap-3 ${
          isSize
            ? "grid-cols-2 sm:grid-cols-4"
            : isProduct
              ? "grid-cols-2 sm:grid-cols-4"
              : "grid-cols-2 sm:grid-cols-3"
        }`}
      >
        {(step.options ?? []).map((opt) => {
          const file = OPTION_IMAGE[`${step.id}::${opt}`];
          const icon = isProduct ? PRODUCT_ICON[opt] : undefined;
          const on = selected === opt;

          return (
            <button
              key={opt}
              type="button"
              onClick={() => onAnswer(opt)}
              className={`group flex flex-col items-center justify-end gap-4 border p-4 transition-colors duration-300 ${
                on
                  ? "border-navy bg-navy text-white"
                  : "border-[color:var(--rule-dark)] hover:border-navy"
              }`}
            >
              {isProduct && icon ? (
                // Their category icon, masked so it takes the tile's colour.
                <span
                  aria-hidden
                  style={{
                    maskImage: `url(${asset(icon)})`,
                    WebkitMaskImage: `url(${asset(icon)})`,
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                  }}
                  className="mt-2 h-10 w-10 flex-none bg-current"
                />
              ) : file ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={asset(ESTIMATOR_IMAGE_DIR + file)}
                  alt=""
                  aria-hidden
                  className="h-20 w-auto object-contain mix-blend-multiply"
                  /* Their Zoho export has not landed yet. Hide a missing file
                     rather than showing a broken-image glyph — the tile still
                     works on its label alone. */
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : !isSize ? (
                <span
                  aria-hidden
                  className="mt-2 block h-16 w-full border border-dashed border-[color:var(--rule-dark)]"
                />
              ) : null}

              <span className="mi text-center leading-tight">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Summary({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div>
      <h2 className="dsp-sm max-w-[20ch] text-[clamp(20px,2.8vw,34px)]">
        That&rsquo;s everything we need.
      </h2>
      <p className="mi mt-4 max-w-[46ch] text-[color:var(--ink-38)]">
        Here is what you have specified. Give us a call and we will price it, or book a free
        on-site measure.
      </p>

      <dl className="mt-8 border-t border-[color:var(--rule-dark)]">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-[color:var(--rule-dark)] py-4"
          >
            <dt className="mi max-w-[60%] text-[color:var(--ink-38)]">{r.label}</dt>
            <dd className="mi ml-auto text-ink">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
