import { cn } from "@/lib/cn";

export function SkillTag({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "bg-bone px-2.5 py-1 font-mono text-xs font-medium uppercase tracking-wide text-void",
        className,
      )}
    >
      {children}
    </span>
  );
}
