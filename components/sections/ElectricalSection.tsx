import { TechGrid } from "@/components/grid/TechGrid";
import { ELECTRICAL_VOCAB } from "@/components/grid/vocab";
import { SkillTag } from "@/components/ui/SkillTag";
import type { Lang } from "@/content/i18n";
import { getDictionary } from "@/content/i18n";
import { ABS_CONTAINER, CONTAINER } from "@/lib/layout";

export function ElectricalSection({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);

  return (
    <section className="relative overflow-hidden bg-void">
      <div className={ABS_CONTAINER}>
        <TechGrid
          mode="words"
          glyphs={ELECTRICAL_VOCAB}
          seed="electrical"
          rows={26}
          cols={23}
          align="left"
          accentColor="#E60000"
          className="inset-0"
        />
      </div>

      <div className={`${CONTAINER} relative z-10 flex flex-col items-start py-44 md:py-56`}>
        <div className="relative w-fit max-w-full">
          <div aria-hidden="true" className="absolute -inset-6 rounded-[2rem] bg-void/85 blur-xl" />
          <div className="relative text-left">
            <h2 className="max-w-2xl font-display text-3xl font-bold tracking-tight text-bone sm:text-4xl lg:text-5xl">
              {t.electrical.heading}
            </h2>

            <ul className="mt-14 flex flex-wrap justify-start gap-2">
              {t.electrical.skills.map((skill) => (
                <li key={skill}>
                  <SkillTag>{skill}</SkillTag>
                </li>
              ))}
            </ul>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-bone-dim">
              {t.electrical.body}
            </p>

            <ul className="mt-6 max-w-xl list-none space-y-2 text-lg leading-relaxed text-bone-dim">
              {t.electrical.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span aria-hidden="true" className="text-bone">
                    &gt;
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
