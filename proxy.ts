import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// script-src needs a fresh nonce every request — Next's App Router streams
// RSC payloads through inline <script id="_R_">/__next_f.push(...) tags, and
// a static 'self'-only CSP silently breaks them (they're inline, not
// file-sourced). A per-request nonce lets those specific tags execute
// without falling back to 'unsafe-inline', which would let CSP catch
// injected inline scripts. This can't live in next.config.ts's static
// headers() — it has to be minted per request, which only proxy can do.
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  // No 'strict-dynamic' — every script here is either same-origin
  // (file-sourced chunks, covered by 'self') or an inline RSC-streaming tag
  // (covered by the nonce), so 'strict-dynamic''s extra propagation model
  // buys nothing here. It also has a rocky cross-browser history (one of
  // the last CSP3 features WebKit shipped, with real Safari bugs mishandling
  // the whole policy when it's present) — dropping it trades a marginal,
  // unused hardening feature for actually working in Safari.
  //
  // Turbopack's dev-mode module runtime (HMR, source-mapped stack traces)
  // evaluates modules via eval()/new Function() — real in dev only. Next
  // itself confirms this in the console: "React will never use eval() in
  // production mode." Restricting the relaxation to development keeps the
  // production CSP fully strict.
  const scriptSrc =
    process.env.NODE_ENV === "development"
      ? `'self' 'nonce-${nonce}' 'unsafe-eval'`
      : `'self' 'nonce-${nonce}'`;
  const csp = `
    default-src 'self';
    script-src ${scriptSrc};
    style-src 'self' 'unsafe-inline';
    img-src 'self' data:;
    font-src 'self';
    connect-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    // Skip static assets and image files — only document/RPC requests need
    // a nonce-bearing CSP; re-running middleware on every font/photo request
    // is pure overhead for a header those responses don't use.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|png|gif|svg|webp|avif|woff2?|pdf)$).*)",
  ],
};
