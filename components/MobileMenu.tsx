"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LangSwitch } from "@/components/ui/LangSwitch";
import type { Lang } from "@/content/i18n";
import { getDictionary } from "@/content/i18n";

export function MobileMenu({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative z-50 flex h-8 w-8 flex-col items-center justify-center gap-1.5 text-bone"
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
      </button>

      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col gap-8 overflow-y-auto bg-void px-6 py-10 font-mono text-lg tracking-wide text-bone-dim">
          <a href="#skills" className="transition-colors hover:text-bone" onClick={() => setOpen(false)}>
            ${t.nav.skills}$
          </a>
          <a href="#projects" className="transition-colors hover:text-bone" onClick={() => setOpen(false)}>
            ~{t.nav.projects}~
          </a>
          <Link
            href="/resume"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-bone"
            onClick={() => setOpen(false)}
          >
            §{t.nav.resume}§
          </Link>
          <a
            href="#site-footer"
            className="inline-flex w-fit bg-bone px-4 py-2 text-void transition-colors hover:bg-bone-dim"
            onClick={() => setOpen(false)}
          >
            !{t.nav.contactMe}!
          </a>

          <LangSwitch lang={lang} path="/" className="mt-auto text-base" />
        </div>
      )}
    </div>
  );
}
