import { ContactForm } from "@/components/ContactForm";
import { TechGrid } from "@/components/grid/TechGrid";
import { LangSwitch } from "@/components/ui/LangSwitch";
import type { Lang } from "@/content/i18n";
import { getDictionary } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { CONTAINER } from "@/lib/layout";

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
        className="inset-x-0 bottom-0 h-[34rem]"
      />

      <div className={`${CONTAINER} relative z-10 py-24`}>
        <div className="grid gap-16 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col">
            <h2 className="font-display text-4xl font-semibold leading-none tracking-tight text-bone sm:text-5xl">
              {siteConfig.name}
            </h2>
            <p className="mt-4 max-w-sm text-bone-dim">{t.contact.availability}</p>

            <ul className="mt-auto space-y-3 pt-8 font-mono text-sm">
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
            </ul>
          </div>

          <div>
            <ContactForm t={t.contact} lang={lang} />
          </div>
        </div>
      </div>

      <div
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
