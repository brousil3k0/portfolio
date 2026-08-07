const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

// In-memory, per-instance rate limiting — fine for a low-traffic personal
// site's contact form. It resets on cold start/redeploy and isn't shared
// across serverless instances, so it's a basic spam deterrent, not a hard
// guarantee; swap for a shared store (e.g. Upstash Redis) if that matters.
const hits = new Map<string, number[]>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_REQUESTS_PER_WINDOW;
}
