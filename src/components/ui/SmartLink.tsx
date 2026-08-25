"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

/**
 * next/link, except same-page hashes scroll instead of just setting the hash.
 *
 * next/link treats `#section` on the current route as a navigation: it
 * updates the URL and stops. That leaves every on-page anchor dead, which on
 * a one-page site is most of them.
 */
export function SmartLink({
  href,
  children,
  onClick,
  ...rest
}: ComponentProps<typeof Link>) {
  const hash = typeof href === "string" && href.startsWith("#") ? href.slice(1) : null;

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (!hash || e.defaultPrevented) return;

    const target = document.getElementById(hash);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${hash}`);
  }

  if (hash) {
    return (
      <a href={href as string} onClick={handleClick} {...(rest as ComponentProps<"a">)}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}
