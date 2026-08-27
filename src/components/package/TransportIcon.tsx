import type { TransportMode } from "@/lib/types";
import { cx } from "@/lib/utils";

/**
 * Transport iconography as SVG, never emoji.
 *
 * Emoji render differently on every platform, cannot inherit colour reliably,
 * and are announced by screen readers as their unicode name — none of which is
 * acceptable for a production itinerary. Each icon here is a single stroked
 * path that inherits `currentColor` and scales cleanly.
 */

const PATHS: Record<TransportMode, string> = {
  flight: "M3 13.5 21 6l-3.2 7.4L21 21l-4.6-2.6-3.1 3.1-.6-4.6-4.5-1.1 3-2.1L3 13.5Z",
  transfer: "M5 17h14M6.5 17v1.6M17.5 17v1.6M4 13.5 5.6 9A2 2 0 0 1 7.5 7.6h9A2 2 0 0 1 18.4 9L20 13.5M4 13.5h16v2.2a1.3 1.3 0 0 1-1.3 1.3H5.3A1.3 1.3 0 0 1 4 15.7v-2.2ZM7 15.2h.01M17 15.2h.01",
  coach: "M4 16.5h16M5.5 16.5v1.8M18.5 16.5v1.8M4 12.6h16M4.6 6.8h14.8v9.7H4.6zM8 6.8v5.8M13 6.8v5.8",
  train: "M8 19.5 6 22M16 19.5 18 22M6.5 16.4h11M5.5 4.6h13v11.8a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2V4.6ZM5.5 10.4h13M9 14h.01M15 14h.01",
  cruise: "M3 17.6c1.6 1 3.2 1 4.8 0s3.2-1 4.8 0 3.2 1 4.8 0 2.2-.7 3.6-1.6M5 14.4V9.6h14v4.8M9.5 9.6V6.4h5v3.2M12 3.2v3.2",
  ferry: "M3 17.6c1.6 1 3.2 1 4.8 0s3.2-1 4.8 0 3.2 1 4.8 0M4.5 14.2 6 9.4h12l1.5 4.8M8 9.4V6.6h8v2.8M12 3.4v3.2",
  walk: "M13.5 4.6a1.4 1.4 0 1 0 0-.02M12.6 8.2 10 10.4l.9 3.4M12.6 8.2l2.6 1.5 1.4 3M12.6 8.2 9.4 9 8 12M10.9 13.8 9.6 17l-2 3.4M10.9 13.8l2.4 1.8.8 4.8",
};

const LABELS: Record<TransportMode, string> = {
  flight: "Flight",
  transfer: "Private transfer",
  coach: "Coach",
  train: "Train",
  cruise: "Boat",
  ferry: "Ferry",
  walk: "On foot",
};

export function TransportIcon({
  mode,
  className,
  title,
}: {
  mode: TransportMode;
  className?: string;
  /** Pass a title to make the icon meaningful rather than decorative. */
  title?: string;
}) {
  const label = title ?? LABELS[mode];
  return (
    <svg
      viewBox="0 0 24 24"
      className={cx("size-5", className)}
      fill="none"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title ? label : undefined}
    >
      {title && <title>{label}</title>}
      <path
        d={PATHS[mode]}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export { LABELS as TRANSPORT_MODE_LABELS };
