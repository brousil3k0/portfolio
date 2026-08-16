import type { Metadata } from "next";
import Link from "next/link";
import { HtmlLangSync } from "@/components/HtmlLangSync";
import { ContactFooter } from "@/components/sections/ContactFooter";
import { LangSwitch } from "@/components/ui/LangSwitch";
import { SkillTag } from "@/components/ui/SkillTag";
import { getDictionary, resolveLang } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { CONTAINER } from "@/lib/layout";

export const metadata: Metadata = {
  title: `${siteConfig.name} — CV`,
};

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-5 w-5 shrink-0 text-bone-dim transition-transform duration-200 group-open:rotate-180 print:hidden"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function CornerArrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-6 w-6 shrink-0 text-bone-dim"
    >
      <path d="M8 4v8a2 2 0 0 0 2 2h8" />
      <path d="M15 11l3 3-3 3" />
    </svg>
  );
}

function Chapter({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details open className="group mb-16 print:mb-10">
      <summary className="flex cursor-pointer list-none items-center justify-between border-b border-line pb-4 [&::-webkit-details-marker]:hidden print:border-black/30">
        <h2 className="font-mono text-lg font-bold uppercase tracking-[0.15em] text-bone sm:text-xl print:text-black">
          {title}
        </h2>
        <ChevronIcon />
      </summary>
      <div className="pt-10 print:pt-6">{children}</div>
    </details>
  );
}

export default async function ResumePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const lang = resolveLang(params.lang);
  const t = getDictionary(lang);
  const r = t.resume;

  return (
    <main id="main-content" className="min-h-screen bg-void py-20 text-bone print:bg-white print:py-8 print:text-black">
      <HtmlLangSync lang={lang} />
      <div className={CONTAINER}>
        <div className="mb-14 flex items-center justify-between print:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wide text-bone-dim transition-colors hover:text-bone"
          >
            ← {r.back}
          </Link>
          <LangSwitch lang={lang} path="/resume" />
        </div>

        <header className="mb-16 border-b border-line pb-10 print:border-black/30">
          <h1 className="font-display text-6xl font-extrabold tracking-tight sm:text-7xl">
            {siteConfig.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bone-dim print:text-black/80">
            {r.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-mono text-base text-bone-dim print:text-black/70">
            <span>{r.location}</span>
            <a href={`mailto:${siteConfig.email}`} className="underline underline-offset-4">
              {siteConfig.email}
            </a>
          </div>
        </header>

        <Chapter title={r.education}>
          <div className="space-y-10">
            {r.educationEntries.map((entry) => (
              <div key={entry.school}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-display text-2xl font-bold">{entry.program}</h3>
                  <span className="font-mono text-sm text-bone-dim print:text-black/60">
                    {entry.period}
                  </span>
                </div>
                <p className="mt-1 text-lg text-bone-dim print:text-black/80">{entry.school}</p>
                <p className="mt-2 text-base text-bone-dim print:text-black/70">{entry.detail}</p>
              </div>
            ))}
          </div>
        </Chapter>

        <Chapter title={r.experience}>
          <div className="space-y-12">
            {r.experienceEntries.map((entry) => (
              <div key={entry.org + entry.role}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-display text-2xl font-bold">{entry.role}</h3>
                  <span className="font-mono text-sm text-bone-dim print:text-black/60">
                    {entry.period}
                  </span>
                </div>
                <p className="mt-1 text-lg text-bone-dim print:text-black/80">{entry.org}</p>
                <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-relaxed text-bone-dim print:text-black/80">
                  {entry.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Chapter>

        <Chapter title={r.certifications.title}>
          <div className="space-y-6">
            {r.certifications.entries.map((entry) => (
              <div key={entry.name} className="flex flex-wrap items-baseline justify-between gap-x-4">
                <div>
                  <h3 className="font-display text-xl font-bold">
                    <a
                      href={entry.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-bone underline decoration-line underline-offset-4 transition-colors hover:decoration-bone print:text-black"
                    >
                      {entry.name} <span aria-hidden="true">↗</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </h3>
                  <p className="mt-1 text-base text-bone-dim print:text-black/80">{entry.issuer}</p>
                </div>
                <span className="font-mono text-sm text-bone-dim print:text-black/60">{entry.year}</span>
              </div>
            ))}
          </div>
        </Chapter>

        <Chapter title={r.skills}>
          <div className="space-y-10">
            {r.skillGroups.map((group) => (
              <div key={group.category}>
                <div className="flex items-center gap-3">
                  <CornerArrow />
                  <h3 className="font-mono text-lg font-bold uppercase tracking-[0.15em] text-bone print:text-black/70">
                    {group.category}
                  </h3>
                </div>
                <ul className="mt-3 flex flex-wrap gap-2 pl-14">
                  {group.items.map((item) => (
                    <li key={item}>
                      <SkillTag className="print:border print:border-black/30 print:bg-transparent print:text-black">
                        {item}
                      </SkillTag>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Chapter>
      </div>

      <div className="print:hidden">
        <ContactFooter lang={lang} />
      </div>
    </main>
  );
}
