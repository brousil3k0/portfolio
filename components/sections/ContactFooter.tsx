import { ContactForm } from "@/components/ContactForm";
import { TechGrid } from "@/components/grid/TechGrid";
import { LangSwitch } from "@/components/ui/LangSwitch";
import type { Lang } from "@/content/i18n";
import { getDictionary } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { CONTAINER } from "@/lib/layout";

function ArrowDownLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M17 7L7 17" />
      <path d="M7 10V17H14" />
    </svg>
  );
}

export function ContactFooter({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const year = new Date().getFullYear();

  return (
    <section id="contact" className="relative scroll-mt-16 overflow-hidden bg-void">
      <TechGrid
        mode="binary"
        glyphs={["0", "1"]}
        seed="contact-footer"
        rows={20}
        cols={68}
        fontSize={20}
        fade="top"
        swapIntervalMs={70}
        swapFraction={0.6}
        className="inset-x-0 bottom-0 h-[34rem]"
      />

      <div className={`${CONTAINER} relative z-10 pt-[5rem] pb-[2rem] md:pt-[7rem] md:pb-[3rem]`}>
        <div className="mb-28 flex justify-end md:mb-36">
          <a href="#contact-form" className="group inline-flex items-center gap-3 whitespace-nowrap">
            <h2 className="font-display text-2xl font-bold tracking-tight text-bone transition-colors group-hover:text-bone-dim sm:text-3xl">
              {t.contact.ctaHeading}
            </h2>
            <ArrowDownLeftIcon
              className="h-6 w-6 shrink-0 text-bone transition-transform duration-200 group-hover:translate-x-[-2px] group-hover:translate-y-[2px] sm:h-[1.875rem] sm:w-[1.875rem]"
            />
          </a>
        </div>

        <div className="grid gap-16 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col">
            <h2 className="font-display text-4xl font-semibold leading-none tracking-tight text-bone sm:text-5xl">
              {siteConfig.name}
            </h2>
            <p className="mt-4 max-w-sm text-bone-dim">{t.contact.availability}</p>

            <ul className="mt-auto space-y-3 pt-8 font-mono text-sm">
              <li>
                <a
                  href="/resume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bone underline decoration-line underline-offset-4 transition-colors hover:decoration-bone"
                >
                  {t.nav.resume} ↗
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bone underline decoration-line underline-offset-4 transition-colors hover:decoration-bone"
                >
                  {t.contact.linkedin} ↗
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bone underline decoration-line underline-offset-4 transition-colors hover:decoration-bone"
                >
                  {t.contact.github} ↗
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-bone underline decoration-line underline-offset-4 transition-colors hover:decoration-bone"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>

          <div id="contact-form" className="scroll-mt-24">
            <ContactForm t={t.contact} lang={lang} />
          </div>
        </div>
      </div>

      <div
        id="site-footer"
        className={`${CONTAINER} relative z-10 flex flex-col items-center justify-between gap-4 py-8 font-mono text-xs text-bone-dim sm:flex-row`}
      >
        <span>
          © {year} {siteConfig.name}
        </span>
        <LangSwitch lang={lang} path="/" />
      </div>
    </section>
  );
}
