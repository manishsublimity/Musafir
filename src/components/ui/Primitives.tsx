import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/lib/utils";
import { breadcrumbSchema } from "@/lib/seo";

/** Small uppercase eyebrow that opens most sections. */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cx(
        "flex items-center gap-3 text-caption font-semibold uppercase tracking-[0.14em] text-muted",
        className,
      )}
    >
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-50" />
      {children}
    </p>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "primary" | "secondary" | "warn";
  className?: string;
}) {
  const tones = {
    neutral: "border-border text-muted",
    primary: "border-primary/40 text-primary bg-primary/8",
    secondary: "border-secondary/40 text-secondary bg-secondary/8",
    warn: "border-clay-400/50 text-clay-400 bg-clay-400/8",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-1 text-caption font-semibold uppercase tracking-[0.1em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cx("border-0 border-t border-border", className)} />;
}

/** Renders a JSON-LD block. Kept as a component so no page hand-writes a script tag. */
export function JsonLd({ data }: { data: Record<string, unknown> | null }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      // Content is generated from our own typed data, never from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export interface Crumb {
  name: string;
  href: string;
}

/**
 * Breadcrumbs, with the matching BreadcrumbList schema emitted alongside so the
 * two can never drift apart.
 */
export function Breadcrumbs({ trail, className }: { trail: Crumb[]; className?: string }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <nav aria-label="Breadcrumb" className={cx("text-label", className)}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted">
          {trail.map((crumb, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="text-text">
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="transition-colors duration-[--duration-fast] hover:text-text"
                  >
                    {crumb.name}
                  </Link>
                )}
                {!last && (
                  <span aria-hidden="true" className="opacity-40">
                    /
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

/** A link with the underline that draws in from the left on hover. */
export function UnderlineLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cx(
        "group/ul relative inline-flex items-center gap-2 font-semibold text-text",
        className,
      )}
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-[--duration-base] ease-[--ease-expo] group-hover/ul:origin-left group-hover/ul:scale-x-100"
      />
      <svg viewBox="0 0 24 24" className="size-3.5 transition-transform duration-[--duration-fast] ease-[--ease-expo] group-hover/ul:translate-x-1" fill="none" aria-hidden="true">
        <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

/** Consistent section wrapper: theme, vertical rhythm and grain in one place. */
export function Section({
  children,
  theme = "night",
  className,
  id,
  ariaLabel,
  padded = true,
}: {
  children: ReactNode;
  theme?: "night" | "day" | "sand";
  className?: string;
  id?: string;
  ariaLabel?: string;
  padded?: boolean;
}) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cx(
        `theme-${theme}`,
        "grain relative bg-background text-text",
        padded && "py-[clamp(4rem,9vw,8.5rem)]",
        className,
      )}
    >
      <span className="grain-layer" aria-hidden="true" />
      <div className="relative z-[2]">{children}</div>
    </section>
  );
}

/** Section heading block — eyebrow, display headline, optional lede and action. */
export function SectionHead({
  eyebrow,
  title,
  lede,
  action,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cx(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <div className={cx("max-w-2xl", align === "center" && "mx-auto text-center")}>
        {eyebrow && <Eyebrow className={cx(align === "center" && "justify-center")}>{eyebrow}</Eyebrow>}
        <h2 className="mt-5 text-h2">{title}</h2>
        {lede && <p className="mt-5 text-lede text-muted">{lede}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/**
 * Empty state used wherever a collection is legitimately empty — no reviews
 * yet, no partners published, no search results. Never filler content.
 */
export function EmptyState({
  title,
  body,
  action,
  className,
}: {
  title: string;
  body: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-lg border border-dashed border-border px-8 py-14 text-center",
        className,
      )}
    >
      <p className="mx-auto max-w-md text-h3">{title}</p>
      <p className="mx-auto mt-4 max-w-lg text-body text-muted">{body}</p>
      {action && <div className="mt-8 flex justify-center">{action}</div>}
    </div>
  );
}
