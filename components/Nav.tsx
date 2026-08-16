import Link from "next/link";
import { MobileMenu } from "@/components/MobileMenu";
import { LangSwitch } from "@/components/ui/LangSwitch";
import type { Lang } from "@/content/i18n";
import { getDictionary } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { CONTAINER } from "@/lib/layout";

export function Nav({ lang, path = "/" }: { lang: Lang; path?: string }) {
  const t = getDictionary(lang);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-void">
      <div className={`${CONTAINER} flex h-16 items-center justify-between font-mono text-sm`}>
        {/* Plain anchor (not next/link): SmoothScrollLinks treats a
            same-page, hash-less link as "scroll to top" — Link's own
            client-side routing would preempt that and just no-op instead. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className="tracking-wide text-bone transition-colors hover:text-bone-dim">
          <span aria-hidden="true">{"> "}</span>
          {siteConfig.handle}
        </a>

        <div className="hidden items-center gap-6 tracking-wide text-bone-dim md:flex">
          {/* Plain anchors (not next/link) on purpose: SmoothScrollLinks
              needs an un-intercepted <a> click to apply its fixed-duration
              scroll — Link's own client-side routing would preempt it.
              The $/~/§/! glyphs are decorative styling, not part of the
              label — hidden from assistive tech so a screen reader hears
              "skills", not "dollar skills dollar". */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/#skills" className="transition-colors hover:text-bone">
            <span aria-hidden="true">$</span>
            {t.nav.skills}
            <span aria-hidden="true">$</span>
          </a>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/#projects" className="transition-colors hover:text-bone">
            <span aria-hidden="true">~</span>
            {t.nav.projects}
            <span aria-hidden="true">~</span>
          </a>
          <Link
            href="/resume"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-bone"
          >
            <span aria-hidden="true">§</span>
            {t.nav.resume}
            <span aria-hidden="true">§</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </Link>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/#site-footer"
            className="ml-6 bg-bone px-4 py-2 text-void transition-colors hover:bg-bone-dim"
          >
            <span aria-hidden="true">!</span>
            {t.nav.contactMe}
            <span aria-hidden="true">!</span>
          </a>
          <LangSwitch lang={lang} path={path} className="ml-6" />
        </div>

        <MobileMenu lang={lang} path={path} />
      </div>
    </header>
  );
}
