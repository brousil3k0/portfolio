import { NextResponse } from "next/server";
import { escapeHtml } from "@/lib/escapeHtml";
import { getContactEnv } from "@/lib/env";
import { getTransporter } from "@/lib/mailer";
import { isRateLimited } from "@/lib/rateLimit";
import { contactFormSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Lightweight CSRF defense: a fetch() POST carries no cookie/session for a
// third-party site to ride on, but without this check any page on the web
// could still silently spam this endpoint from a visitor's browser. Origin
// (sent by all modern browsers on same-site fetches) falling back to
// Referer covers the browsers that omit Origin on same-origin requests.
function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin") ?? req.headers.get("referer");
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(req.url).origin;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages sent. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form fields.", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  if (parsed.data.company) {
    // Honeypot tripped — pretend success so bots don't learn anything.
    return NextResponse.json({ ok: true });
  }

  try {
    const env = getContactEnv();
    const transporter = getTransporter();
    // Strip CR/LF before the name reaches an email header — nodemailer
    // sanitizes header values itself, but a user-controlled string landing
    // in a header is exactly the shape of a header-injection bug, so this
    // stays defensive even against a future mail library that doesn't.
    const safeName = parsed.data.name.replace(/[\r\n]+/g, " ");
    await transporter.sendMail({
      from: `"Portfolio Contact" <${env.user}>`,
      to: env.to,
      replyTo: parsed.data.email,
      subject: `New message from ${safeName}`,
      text: parsed.data.message,
      html: `<p><strong>${escapeHtml(safeName)}</strong> (${escapeHtml(
        parsed.data.email,
      )})</p><p>${escapeHtml(parsed.data.message).replace(/\n/g, "<br/>")}</p>`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact route error", err);
    return NextResponse.json(
      { error: "Failed to send message. Try again later." },
      { status: 502 },
    );
  }
}
