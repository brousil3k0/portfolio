"use client";

import { useMemo, useState } from "react";
import type { Lang } from "@/content/i18n";
import { getDictionary } from "@/content/i18n";
import { cn } from "@/lib/cn";
import { CONTAINER } from "@/lib/layout";

function filterButtonClass(active: boolean) {
  return cn(
    "px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide transition-colors",
    active ? "bg-bone text-void" : "border border-line text-bone-dim hover:border-bone hover:text-bone",
  );
}

export function ProjectsSection({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const p = t.projects;
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tagKeys = Object.keys(p.tags) as (keyof typeof p.tags)[];

  const filtered = useMemo(() => {
    if (!activeTag) return p.items;
    return p.items.filter((item) => (item.tags as readonly string[]).includes(activeTag));
  }, [activeTag, p.items]);

  return (
    <section id="projects" className="relative scroll-mt-16 bg-void">
      <div className={`${CONTAINER} relative z-10 pt-[9rem] pb-[5rem] md:pt-[12rem] md:pb-[7rem]`}>
        <h2 className="max-w-2xl font-display text-3xl font-bold tracking-tight text-bone sm:text-4xl lg:text-5xl">
          {p.heading}
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-bone-dim">{p.body}</p>

        <div className="mt-10 flex flex-wrap gap-1.5">
          <button type="button" onClick={() => setActiveTag(null)} className={filterButtonClass(activeTag === null)}>
            {p.filterAll}
          </button>
          {tagKeys.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTag(key)}
              className={filterButtonClass(activeTag === key)}
            >
              {p.tags[key]}
            </button>
          ))}
        </div>

        <div className="relative mt-12">
          <ul className="thin-scrollbar flex h-56 snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth">
            {filtered.map((item) => (
              <li
                key={item.name}
                className="flex h-52 w-72 shrink-0 snap-start flex-col overflow-hidden border border-line p-5 sm:w-80"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="line-clamp-1 font-display text-base font-bold text-bone">{item.name}</h3>
                  <span className="shrink-0 font-mono text-xs text-bone-dim">{item.year}</span>
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {item.tags.map((tagKey) => (
                    <span
                      key={tagKey}
                      className="bg-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-bone-dim"
                    >
                      {p.tags[tagKey as keyof typeof p.tags]}
                    </span>
                  ))}
                </div>

                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-bone-dim">{item.description}</p>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex w-fit items-center gap-2 font-mono text-xs text-bone underline decoration-line underline-offset-4 transition-colors hover:decoration-bone"
                >
                  {p.viewProject} ↗
                </a>
              </li>
            ))}
          </ul>

          <div className="pointer-events-none absolute top-0 right-0 h-56 w-16 bg-gradient-to-l from-void to-transparent" />
        </div>
      </div>
    </section>
  );
}
