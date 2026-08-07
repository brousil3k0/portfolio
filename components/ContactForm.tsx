"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { contactFormSchema } from "@/lib/validation";
import { cn } from "@/lib/cn";
import type { Lang } from "@/content/i18n";

type Status = "idle" | "submitting" | "success" | "error";

const fieldClasses =
  "w-full border border-line bg-void px-4 py-3 text-bone placeholder:text-bone-dim/50 focus:border-bone focus:outline-none";

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <circle cx="12" cy="8" r="3.25" />
      <path d="M4.5 20c1.4-4 3.9-6 7.5-6s6.1 2 7.5 6" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <rect x="3.5" y="5.5" width="17" height="13" rx="1" />
      <path d="M4 6.5l8 6 8-6" />
    </svg>
  );
}

export function ContactForm({
  t,
  lang,
}: {
  t: {
    nameLabel: string;
    emailLabel: string;
    messageLabel: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    send: string;
    sending: string;
    success: string;
    errorValidation: string;
    errorGeneric: string;
    gdprPrefix: string;
    gdprLinkText: string;
    gdprSuffix: string;
  };
  lang: Lang;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = contactFormSchema.safeParse(formData);

    if (!parsed.success) {
      setStatus("error");
      setErrorMsg(t.errorValidation);
      return;
    }

    setStatus("submitting");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? t.errorGeneric);
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : t.errorGeneric);
    }
  }

  if (status === "success") {
    return (
      <div className="border border-line bg-void px-6 py-8 font-mono text-sm text-bone">
        {t.success}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-4" noValidate>
      <div className="relative">
        <label htmlFor="name" className="sr-only">
          {t.nameLabel}
        </label>
        <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-bone-dim">
          <UserIcon />
        </span>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder={t.namePlaceholder}
          className={cn(fieldClasses, "pl-11")}
        />
      </div>

      <div className="relative">
        <label htmlFor="email" className="sr-only">
          {t.emailLabel}
        </label>
        <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-bone-dim">
          <MailIcon />
        </span>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder={t.emailPlaceholder}
          className={cn(fieldClasses, "pl-11")}
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block font-mono text-xs uppercase tracking-wide text-bone-dim">
          {t.messageLabel}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder={t.messagePlaceholder}
          className={cn(fieldClasses, "resize-none")}
        />
      </div>

      <label htmlFor="gdprConsent" className="flex cursor-pointer items-start gap-3 text-sm text-bone-dim">
        <span className="relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border border-line bg-void">
          <input
            id="gdprConsent"
            name="gdprConsent"
            type="checkbox"
            value="on"
            required
            className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone"
          />
          <span aria-hidden="true" className="hidden h-2 w-2 bg-bone peer-checked:block" />
        </span>
        <span>
          {t.gdprPrefix}
          <Link
            href={`/privacy?lang=${lang}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-bone underline decoration-line underline-offset-4 transition-colors hover:decoration-bone"
          >
            {t.gdprLinkText}
          </Link>
          {t.gdprSuffix}
        </span>
      </label>

      {/* Honeypot — hidden from real users, not display:none so naive bots still fill it in. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-bone px-6 py-3 font-mono text-sm uppercase tracking-wide text-void transition-colors hover:bg-bone-dim disabled:opacity-60"
      >
        {status === "submitting" ? t.sending : t.send}
      </button>

      <p
        role="status"
        aria-live="polite"
        className="absolute left-0 top-full mt-2 font-mono text-xs text-bone-dim"
      >
        {status === "error" && errorMsg}
      </p>
    </form>
  );
}
