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
    <div className={cn("flex items-center gap-1 font-mono text-xs tracking-wide", className)}>
      <Link
        href={`${path}?lang=en`}
        aria-current={lang === "en"}
        className={cn(
          "px-1 transition-colors",
          lang === "en" ? "text-bone" : "text-bone-dim hover:text-bone",
        )}
      >
        &EN&
      </Link>
      <span className="text-line" aria-hidden="true">
        /
      </span>
      <Link
        href={`${path}?lang=cs`}
        aria-current={lang === "cs"}
        className={cn(
          "px-1 transition-colors",
          lang === "cs" ? "text-bone" : "text-bone-dim hover:text-bone",
        )}
      >
        &CZ&
      </Link>
    </div>
  );
}
