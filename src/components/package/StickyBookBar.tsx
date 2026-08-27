"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatMoney } from "@/lib/format";
import { track } from "@/lib/analytics";
import { cx } from "@/lib/utils";

/**
 * The mobile booking bar.
 *
 * Appears only once the hero has scrolled away, so it never covers the hero's
 * own call to action, and hides again at the footer so it does not sit on top
 * of the final CTA. Desktop keeps the sticky price panel in the customiser
 * instead — two competing sticky CTAs on one page is one too many.
 */
export function StickyBookBar({
  title,
  price,
  href,
  packageSlug,
}: {
  title: string;
  price: number;
  href: string;
  packageSlug: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.8;
      const nearBottom =
        window.innerHeight + window.scrollY > document.body.scrollHeight - 600;
      setVisible(past && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cx(
        "theme-sand fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl transition-transform duration-[--duration-base] ease-[--ease-expo] lg:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="container-editorial flex items-center justify-between gap-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-caption uppercase tracking-[0.1em] text-muted">{title}</p>
          <p className="mt-0.5 text-label font-semibold text-text">
            From {formatMoney({ amount: price, currency: "INR" })}
            <span className="font-normal text-muted"> / person</span>
          </p>
        </div>

        <Link
          href={href}
          data-cta
          onClick={() => track("booking_started", { package: packageSlug, source: "sticky-bar" })}
          className="inline-flex h-12 shrink-0 items-center rounded-pill bg-primary px-6 text-label font-semibold text-primary-contrast"
        >
          Book this trip
        </Link>
      </div>
    </div>
  );
}
