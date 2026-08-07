export function ScrollCue({
  href = "#about",
  label = "Scroll",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <a
      href={href}
      className="group absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-bone-dim transition-colors hover:text-bone focus-visible:text-bone"
    >
      <span>{label}</span>
      <span aria-hidden="true" className="h-8 w-px bg-current" />
    </a>
  );
}
