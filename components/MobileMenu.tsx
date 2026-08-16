"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LangSwitch } from "@/components/ui/LangSwitch";
import type { Lang } from "@/content/i18n";
import { getDictionary } from "@/content/i18n";

export function MobileMenu({ lang, path = "/" }: { lang: Lang; path?: string }) {
  const t = getDictionary(lang);
  const [open, setOpen] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    setOpen(false);
    if (detailsRef.current) detailsRef.current.open = false;
  }

  return (
    // Native <details>/<summary> instead of a button + onClick-driven boolean —
    // the open/close toggle is then handled by the browser itself (a native,
    // guaranteed-reliable interaction), not by React's synthetic click event
    // reaching a handler. iOS Safari has been reported not responding to a
    // plain button toggle here; this sidesteps that class of issue entirely
    // since there's no JS required for the disclosure itself to work.
    <details
      ref={detailsRef}
      className="md:hidden"
      onToggle={(e) => setOpen(e.currentTarget.open)}
    >
      <summary
        aria-label={open ? "Close menu" : "Open menu"}
        className="relative z-50 flex h-11 w-11 touch-manipulation cursor-pointer list-none flex-col items-center justify-center gap-1.5 text-bone [&::-webkit-details-marker]:hidden [&::marker]:hidden"
      >
        <span
          aria-hidden="true"
          className={`block h-px w-6 bg-current transition-transform duration-200 ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
        />
        <span
          aria-hidden="true"
          className={`block h-px w-6 bg-current transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`}
        />
        <span
          aria-hidden="true"
          className={`block h-px w-6 bg-current transition-transform duration-200 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
        />
      </summary>

      <div className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col gap-8 overflow-y-auto bg-void px-6 py-10 font-mono text-lg tracking-wide text-bone-dim">
        {/* Plain anchors (not next/link) on purpose: SmoothScrollLinks
            needs an un-intercepted <a> click to apply its fixed-duration
            scroll — Link's own client-side routing would preempt it. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/#skills" className="transition-colors hover:text-bone" onClick={close}>
          <span aria-hidden="true">$</span>
          {t.nav.skills}
          <span aria-hidden="true">$</span>
        </a>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/#projects" className="transition-colors hover:text-bone" onClick={close}>
          <span aria-hidden="true">~</span>
          {t.nav.projects}
          <span aria-hidden="true">~</span>
        </a>
        <Link
          href="/resume"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-bone"
          onClick={close}
        >
          <span aria-hidden="true">§</span>
          {t.nav.resume}
          <span aria-hidden="true">§</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </Link>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/#site-footer"
          className="inline-flex w-fit bg-bone px-4 py-2 text-void transition-colors hover:bg-bone-dim"
          onClick={close}
        >
          <span aria-hidden="true">!</span>
          {t.nav.contactMe}
          <span aria-hidden="true">!</span>
        </a>

        <LangSwitch lang={lang} path={path} className="mt-auto text-base" />
      </div>
    </details>
  );
}
