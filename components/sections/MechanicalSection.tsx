import { TechGrid } from "@/components/grid/TechGrid";
import { MECHANICAL_VOCAB } from "@/components/grid/vocab";
import { SkillTag } from "@/components/ui/SkillTag";
import type { Lang } from "@/content/i18n";
import { getDictionary } from "@/content/i18n";
import { CONTAINER } from "@/lib/layout";

export function MechanicalSection({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);

  return (
    <section id="skills" className="relative flex min-h-[90vh] scroll-mt-16 items-center overflow-hidden bg-void">
      <TechGrid
        mode="words"
        glyphs={MECHANICAL_VOCAB}
        seed="mechanical"
        rows={30}
        cols={26}
        align="right"
        className="inset-0"
      />

      <div
        className={`${CONTAINER} relative z-10 flex flex-col items-end py-24 text-right bg-[radial-gradient(ellipse_at_75%_50%,rgba(7,7,7,0.75)_0%,rgba(7,7,7,0.45)_45%,transparent_75%)]`}
      >
        <h2 className="max-w-2xl font-display text-3xl font-bold tracking-tight text-bone sm:text-4xl lg:text-5xl">
          {t.mechanical.heading}
        </h2>

        <ul className="mt-14 flex flex-wrap justify-end gap-2">
          {t.mechanical.skills.map((skill) => (
            <li key={skill}>
              <SkillTag>{skill}</SkillTag>
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-bone-dim">
          {t.mechanical.body}
        </p>

        <ul className="mt-6 max-w-xl list-none space-y-2 text-lg leading-relaxed text-bone-dim">
          {t.mechanical.bullets.map((bullet) => (
            <li key={bullet} className="flex justify-end gap-2">
              <span>{bullet}</span>
              <span aria-hidden="true" className="text-bone">
                &lt;
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
