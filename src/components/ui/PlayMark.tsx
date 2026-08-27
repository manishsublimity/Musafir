import { cx } from "@/lib/utils";

/**
 * The Musafir play-mark — the arrowhead-with-a-tail from the logo, supplied as
 * `Vector.svg`. Used as the badge on selection cards and as a bullet in the
 * marquee strip, so the same silhouette appears at three scales across the
 * flow and reads as a single brand device.
 *
 * Inherits `currentColor` so it can sit on amber, ink or cream.
 */
export function PlayMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 110 87"
      className={cx("size-5", className)}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M26.7924 0L24.2691 1.7697C23.2531 2.30377 22.6282 2.64049 21.741 3.05042C22.4192 9.82115 27.0419 12.9418 31.034 16.6739C50.3665 34.745 46.5015 33.0303 58.4472 26.6115C62.2782 24.5526 69.8675 20.157 72.6398 17.8252C71.8931 17.0633 72.7411 17.6957 71.4334 16.8905C70.8501 16.531 70.6089 16.4531 69.9993 16.1861C69.1964 15.8347 68.1119 15.4283 67.2405 15.0594C57.5183 10.9496 34.9358 0.780608 26.7924 0Z"
        fill="currentColor"
      />
      <path
        d="M88.8809 35.5888C93.8315 31.7321 102.797 25.1329 106.786 22.3021C108.893 20.834 110.552 17.1746 109.07 13.894C105.944 2.74238 92.1866 11.4321 88.3948 13.6738C80.2104 18.5133 71.8674 23.2654 62.3672 28.9112C53.2517 34.328 45.0012 39.1036 36.3547 44.0772C27.7358 49.036 17.3477 56.1723 5.39323 62.7203C-5.02544 68.4271 -0.570656 84.33 20.6917 72.2159C31.0339 66.3235 55.7031 51.69 60.1091 50.8836C62.9417 55.8109 65.3625 85.3352 70.5474 86.9679C74.9605 86.6862 78.8466 83.2411 79.4275 78.794C80.108 73.5827 81.1954 68.6432 81.9936 63.8629C82.7086 59.5798 83.1625 46.8231 85.5833 39.9744C86.4178 37.6145 87.4262 36.5358 88.8809 35.5888Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * The dotted flight path that decorates the section corners. Drawn rather than
 * imported so the dash rhythm and end-cap can follow the layout, and so it can
 * animate its own draw-in without a second asset.
 */
export function DottedPath({
  className,
  flip = false,
  animate = true,
}: {
  className?: string;
  flip?: boolean;
  animate?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 240 300"
      className={cx("h-auto w-full", className)}
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path
        d="M232 8C168 18 196 74 138 92 74 112 12 96 8 148c-4 52 78 44 106 72 24 24 4 60-38 72"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="1 12"
        className={animate ? "route-draw" : undefined}
        opacity="0.55"
      />
    </svg>
  );
}

/** Map-pin outline used opposite the dotted path. */
export function PinMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 52"
      className={cx("size-10", className)}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M20 2c9.94 0 18 8.06 18 18 0 12.5-18 30-18 30S2 32.5 2 20C2 10.06 10.06 2 20 2Z"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <circle cx="20" cy="20" r="6.5" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  );
}
