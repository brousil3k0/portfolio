import { NextResponse } from "next/server";
import { escapeHtml } from "@/lib/escapeHtml";
import { getContactEnv } from "@/lib/env";
import { getTransporter } from "@/lib/mailer";
import { isRateLimited } from "@/lib/rateLimit";
import { contactFormSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
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
    await transporter.sendMail({
      from: `"Portfolio Contact" <${env.user}>`,
      to: env.to,
      replyTo: parsed.data.email,
      subject: `New message from ${parsed.data.name}`,
      text: parsed.data.message,
      html: `<p><strong>${escapeHtml(parsed.data.name)}</strong> (${escapeHtml(
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
