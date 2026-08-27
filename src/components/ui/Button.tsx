"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { cx } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-contrast hover:brightness-110 shadow-[0_10px_30px_-12px] shadow-primary/60",
  secondary:
    "bg-surface-raised text-text border border-border hover:border-border-strong hover:bg-surface",
  outline:
    "border border-border-strong text-text hover:bg-text hover:text-background",
  ghost: "text-text hover:text-primary",
};

const SIZES: Record<Size, string> = {
  sm: "h-10 px-4 text-label",
  md: "h-12 px-6 text-label",
  lg: "h-14 px-8 text-body",
};

const BASE =
  "group/btn relative inline-flex items-center justify-center gap-2.5 rounded-pill font-semibold tracking-tight transition-[background-color,color,border-color,filter,box-shadow] duration-[--duration-fast] ease-[--ease-expo] disabled:pointer-events-none disabled:opacity-50";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
  /** Adds the arrow that nudges forward on hover. */
  arrow?: boolean;
  /** Turns off the magnetic pull — for buttons inside dense toolbars. */
  still?: boolean;
}

function Inner({ children, arrow }: { children: ReactNode; arrow?: boolean }) {
  return (
    <>
      <span>{children}</span>
      {arrow && (
        <svg
          viewBox="0 0 24 24"
          className="size-4 shrink-0 transition-transform duration-[--duration-fast] ease-[--ease-expo] group-hover/btn:translate-x-1.5"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 12h14m-6-6 6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  children,
  className,
  arrow,
  still,
  ...rest
}: CommonProps & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">) {
  const link = (
    <Link
      href={href}
      data-cta
      className={cx(BASE, VARIANTS[variant], SIZES[size], className)}
      {...rest}
    >
      <Inner arrow={arrow}>{children}</Inner>
    </Link>
  );
  return still ? link : <Magnetic strength={10}>{link}</Magnetic>;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  arrow,
  still,
  ...rest
}: CommonProps & ComponentProps<"button">) {
  const button = (
    <button className={cx(BASE, VARIANTS[variant], SIZES[size], className)} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </button>
  );
  return still ? button : <Magnetic strength={10}>{button}</Magnetic>;
}
