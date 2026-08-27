import Image from "next/image";
import { cx } from "@/lib/utils";

/**
 * The Musafir Travels wordmark, served as a static SVG.
 *
 * Two variants exist because the mark is drawn in exactly two colours — the
 * brand amber (#FFB403) and a charcoal (#2B2A29). The charcoal disappears on
 * the dark navigation, so `musafir-travels-light.svg` swaps it for the site's
 * cream while leaving the amber untouched. Shipping two small static files is
 * cheaper than inlining 12KB of SVG into the client bundle on every render.
 */
export function Logo({
  className,
  compact = false,
  tone = "light",
}: {
  className?: string;
  /** Shrinks the lockup once the nav condenses on scroll. */
  compact?: boolean;
  /** `light` = for dark surfaces. `dark` = for cream surfaces. */
  tone?: "light" | "dark";
}) {
  const src = tone === "light" ? "/brand/musafir-travels-light.svg" : "/brand/musafir-travels.svg";

  return (
    <span
      className={cx(
        "relative block transition-[width,height] duration-[--duration-base] ease-[--ease-expo]",
        compact ? "h-9 w-[66px]" : "h-12 w-[88px]",
        className,
      )}
    >
      <Image
        src={src}
        alt="Musafir Travels"
        fill
        priority
        sizes="88px"
        className="object-contain object-left"
      />
    </span>
  );
}
