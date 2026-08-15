"use client";

import { useEffect } from "react";
import { smoothScrollTo } from "@/lib/smoothScroll";

/** Mounted once in the root layout. Intercepts clicks on any in-page anchor
 * link (nav, mobile menu, footer CTA, the logo/home link, …) via event
 * delegation on `document` — this keeps Nav/MobileMenu/ContactFooter as
 * plain `<a href="/…">` markup (no per-component client conversion needed)
 * while giving every one of them the same fixed-duration scroll.
 *
 * Nav's links use an absolute `/#skills`-style href (not a bare `#skills`)
 * so they still work when rendered on a different route, like the project
 * detail page — from there, a link would navigate home first instead of
 * just tacking a hash onto the current URL. A same-page link with no hash
 * (the logo, `href="/"`) is treated as "scroll to top". Clicks are only
 * intercepted (and smooth-scrolled) when the link's path matches the
 * current page; otherwise the browser is left to do its normal cross-page
 * navigation. */
export function SmoothScrollLinks() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0) return;
      const link = (e.target as HTMLElement).closest("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.target && link.target !== "_self") return;

      let url: URL;
      try {
        url = new URL(link.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;

      const hasHash = Boolean(url.hash) && url.hash !== "#";
      const target = hasHash ? document.querySelector(url.hash) : null;
      if (hasHash && !target) return;

      e.preventDefault();

      const targetY = target
        ? target.getBoundingClientRect().top +
          window.scrollY -
          parseFloat(getComputedStyle(target).scrollMarginTop || "0")
        : 0;

      if (reduced) {
        window.scrollTo(0, targetY);
      } else {
        smoothScrollTo(targetY);
      }

      history.pushState(null, "", hasHash ? url.hash : url.pathname);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
