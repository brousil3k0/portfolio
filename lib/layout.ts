export const CONTAINER = "mx-auto w-full max-w-6xl px-6";

/** Same width/centering/padding as CONTAINER but for an absolutely
 * positioned background layer (no `w-full` — with `inset-0` already pinning
 * both edges, an explicit width would override the auto side-margins that
 * center the box within them). Used to keep a section's TechGrid halo
 * aligned with its CONTAINER-bound foreground text at wide viewports —
 * without this, a full-bleed background centers on the whole viewport while
 * the text stays capped at max-w-6xl, so the two drift apart as the
 * viewport grows past ~1152px (e.g. zoomed out). */
export const ABS_CONTAINER = "pointer-events-none absolute inset-0 mx-auto max-w-6xl px-6";
