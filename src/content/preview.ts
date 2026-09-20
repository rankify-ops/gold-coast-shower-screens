/*
 * Client preview window — shared with the precision-painting-pro build.
 *
 * One fixed deadline for every visitor. While it is in the future a floating
 * countdown pill shows; once it has passed, every route blurs out behind a
 * "preview ended — request an extension" gate.
 *
 *   Extend:  set PREVIEW_ENDS to a future time and push.
 *   Remove:  set PREVIEW_ENABLED to false.
 *   Test:    add ?preview=expired to any URL.
 */
// Unlocked 20 Sep 2026 so Tom can work on the live preview. Set back to true
// (and push a future PREVIEW_ENDS) to put the lock back.
export const PREVIEW_ENABLED = false;

// Already passed: the preview is ended as of 14 September 2026.
export const PREVIEW_ENDS = "2026-09-14T00:00:00Z";

export const PREVIEW_CONTACT = "hello@rankify.com.au";

export function extensionMailto(state: "active" | "expired") {
  const subject = "Website preview extension request — Gold Coast Shower Screens";
  const body =
    state === "expired"
      ? "Hi Rankify,\n\nOur website preview has ended. Could we please get an extension so we can keep reviewing it?\n\nThanks,\n"
      : "Hi Rankify,\n\nCould we please get an extension on our website preview before it ends?\n\nThanks,\n";
  return `mailto:${PREVIEW_CONTACT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
