import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "accent" | "outline" | "ghost" | "white";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary: "bg-navy-900 text-white hover:bg-navy-800 shadow-[0_10px_24px_-12px_rgb(12_33_56/0.6)]",
  accent: "bg-copper text-white hover:brightness-105 shadow-glow",
  outline: "border border-ink-900/15 bg-white text-ink-900 hover:border-navy-900 hover:text-navy-900",
  ghost: "text-ink-700 hover:bg-ink-100 hover:text-ink-900",
  white: "bg-white text-navy-900 ring-1 ring-ink-900/8 hover:bg-sky-50",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-13 px-7 text-base",
};

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export function Button({ variant = "primary", size = "md", className = "", children, ...rest }: Common & ComponentProps<"button">) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({ variant = "primary", size = "md", className = "", children, href, ...rest }: Common & { href: string } & Omit<ComponentProps<typeof Link>, "href">) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </Link>
  );
}
