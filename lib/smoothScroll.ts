/** Fixed wall-clock duration for every in-page anchor scroll, regardless of
 * distance — native `scroll-behavior: smooth` scales its duration with
 * distance, which reads as slow/inconsistent for far-apart sections. */
export const SCROLL_DURATION_MS = 450;

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

export function smoothScrollTo(targetY: number, duration = SCROLL_DURATION_MS) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  if (distance === 0) return;

  const startTime = performance.now();

  function step(now: number) {
    const elapsed = Math.min(1, (now - startTime) / duration);
    window.scrollTo(0, startY + distance * easeInOutQuad(elapsed));
    if (elapsed < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}
