import type { Metadata } from "next";
import Link from "next/link";
import { HtmlLangSync } from "@/components/HtmlLangSync";
import { LangSwitch } from "@/components/ui/LangSwitch";
import { getDictionary, resolveLang } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { CONTAINER } from "@/lib/layout";

export const metadata: Metadata = {
  title: `${siteConfig.name} — Zásady zpracování osobních údajů`,
};

export default async function PrivacyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const lang = resolveLang(params.lang);
  const t = getDictionary(lang);
  const p = t.privacy;

  return (
    <main id="main-content" className="min-h-screen bg-void py-20 text-bone">
      <HtmlLangSync lang={lang} />
      <div className={CONTAINER}>
        <div className="mb-14 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wide text-bone-dim transition-colors hover:text-bone"
          >
            ← {p.back}
          </Link>
          <LangSwitch lang={lang} path="/privacy" />
        </div>

        <header className="mb-16 border-b border-line pb-10">
          <h1 className="max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            {p.title}
          </h1>
          <p className="mt-4 font-mono text-sm uppercase tracking-wide text-bone-dim">
            {p.updated}
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bone-dim">{p.intro}</p>
        </header>

        <div className="max-w-2xl space-y-10">
          {p.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-mono text-base font-bold uppercase tracking-[0.15em] text-bone">
                {section.heading}
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-bone-dim">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
