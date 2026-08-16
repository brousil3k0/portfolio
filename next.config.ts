import type { NextConfig } from "next";

// Content-Security-Policy is set per-request in middleware.ts instead —
// it needs a fresh nonce every time to let Next's own inline RSC-streaming
// scripts run without a blanket 'unsafe-inline'. Everything here is static
// and safe to send on every response regardless of request content.
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  // Vercel serves the site over HTTPS only; safe to pin every future visit
  // to it. Two-year max-age + preload matches the HSTS preload list minimum.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Applies to every route, including the API — response headers are
        // as relevant to a JSON error response as to an HTML page.
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
      {
        // Static portfolio assets (project photos, certificate PDFs) are
        // content-addressed by hand-picked, stable filenames that only
        // change when someone edits content/i18n.ts — safe to cache at the
        // browser and CDN for a long time, which is most of what
        // "sustainable" means for a static asset: don't make the visitor's
        // device re-fetch bytes it already has.
        source: "/(certificates|projects)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
