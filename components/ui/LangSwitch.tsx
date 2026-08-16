import Link from "next/link";
import type { Lang } from "@/content/i18n";
import { cn } from "@/lib/cn";

export function LangSwitch({
  lang,
  path,
  className,
}: {
  lang: Lang;
  path: string;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label="Language"
      className={cn("flex items-center gap-1 font-mono text-xs tracking-wide", className)}
    >
      <Link
        href={`${path}?lang=en`}
        lang="en"
        hrefLang="en"
        aria-current={lang === "en"}
        className={cn(
          "px-1 transition-colors",
          lang === "en" ? "text-bone" : "text-bone-dim hover:text-bone",
        )}
      >
        <span aria-hidden="true">&</span>
        EN
        <span aria-hidden="true">&</span>
      </Link>
      <span className="text-line" aria-hidden="true">
        /
      </span>
      <Link
        href={`${path}?lang=cs`}
        lang="cs"
        hrefLang="cs"
        aria-current={lang === "cs"}
        className={cn(
          "px-1 transition-colors",
          lang === "cs" ? "text-bone" : "text-bone-dim hover:text-bone",
        )}
      >
        <span aria-hidden="true">&</span>
        CZ
        <span aria-hidden="true">&</span>
      </Link>
    </div>
  );
}
