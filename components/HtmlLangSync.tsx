"use client";

import { useEffect } from "react";
import type { Lang } from "@/content/i18n";

// The root <html lang> is fixed at build time, but the site's actual
// language is chosen at request time via ?lang=. A mismatched lang attribute
// makes screen readers apply the wrong pronunciation/voice to every word on
// the page — this keeps it in sync with whatever language actually rendered.
export function HtmlLangSync({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}
