import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const base =
  "inline-flex items-center gap-2 px-6 py-3 font-mono text-sm uppercase tracking-wide transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone";

const variants = {
  primary: "bg-bone text-void hover:bg-bone-dim",
  ghost: "border border-line text-bone hover:border-bone",
};

type Variant = keyof typeof variants;

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined;
  variant?: Variant;
};

export function Button(props: LinkProps | ButtonProps) {
  const { variant = "primary", className, ...rest } = props;
  const classes = cn(base, variants[variant], className);

  if ("href" in rest && rest.href) {
    const { href, ...anchorRest } = rest as LinkProps;
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {rest.children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)} />
  );
}
