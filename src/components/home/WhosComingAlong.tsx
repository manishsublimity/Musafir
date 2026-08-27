"use client";

import Link from "next/link";
import { ShapeCard } from "@/components/cards/ShapeCard";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { DottedPath, PinMark, PlayMark } from "@/components/ui/PlayMark";
import { TRAVEL_WITH } from "@/components/customize/steps";
import { site } from "@/content/site";
import { track } from "@/lib/analytics";

/**
 * "WHO'S COMING ALONG?"
 *
 * The homepage entry into the trip customiser, built on the brand's play-shape
 * silhouette. Each card deep-links into `/customize` with step one already
 * answered, so choosing here does not mean answering it twice.
 *
 * Motion identity: *the approach*. A dotted flight path draws itself in on one
 * side, the cards rise in sequence, and the marquee underneath keeps moving —
 * the section reads as travel already in progress.
 *
 * On colour: the reference layout uses a deep green field with a yellow accent.
 * Musafir's mark is only ever two colours — amber #FFB403 and charcoal #2B2A29
 * — so this uses the charcoal field with the amber accent. Same structure,
 * Musafir's palette.
 */
export function WhosComingAlong() {
  return (
    <section
      aria-label="Who is travelling"
      className="theme-sand grain relative isolate overflow-hidden bg-background pb-0 pt-[clamp(4rem,9vw,7.5rem)] text-text"
    >
      {/* Warm pool of light behind the cards, so the field is not flat black. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 aspect-square w-[120vw] max-w-[1400px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-[0.14]"
        style={{
          background:
            "radial-gradient(circle, var(--color-amber-400) 0%, transparent 62%)",
        }}
      />
      <span className="grain-layer" aria-hidden="true" />

      {/* Decorative flight path + pin, mirroring the reference composition. */}
      <DottedPath
        className="pointer-events-none absolute -left-8 top-16 -z-10 w-40 text-primary/45 md:w-56 lg:w-64"
      />
      <PlayMark className="pointer-events-none absolute left-24 top-14 -z-10 size-7 -rotate-12 text-primary/70 md:left-36 md:size-9" />
      <PinMark className="pointer-events-none absolute right-10 top-24 -z-10 size-8 text-primary/40 md:right-20 md:size-11" />
      <DottedPath
        flip
        animate={false}
        className="pointer-events-none absolute -right-10 top-32 -z-10 w-40 text-primary/25 md:w-56"
      />

      <div className="container-editorial relative z-[2]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="flex items-center justify-center gap-3 text-caption font-semibold uppercase tracking-[0.16em] text-primary">
            <PlayMark className="size-4" />
            Start your trip
          </p>

          <SplitText
            lines={["Who's coming along?"]}
            className="mt-6 text-h1 text-text-strong"
            lineClassName="text-center"
          />

          <p className="mt-5 text-lede text-muted">
            Every journey is <span className="font-semibold text-primary">better together.</span>
          </p>
        </div>

        <Reveal
          variant="rise"
          stagger={0.1}
          as="ul"
          className="mx-auto mt-16 grid max-w-6xl grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4 lg:gap-x-8"
        >
          {TRAVEL_WITH.map((option) => (
            <li key={option.id}>
              <Link
                href={`/customize?travelWith=${option.id}`}
                onClick={() =>
                  track("plan_trip_clicked", { source: "whos-coming", value: option.id })
                }
                data-cta
                aria-label={`${option.label} — ${option.blurb}`}
                className="block rounded-lg outline-offset-8"
              >
                <ShapeCard
                  as="div"
                  label={option.label}
                  blurb={option.blurb}
                  scene={option.scene}
                  seed={`who-${option.id}`}
                  image={option.image}
                  imageAlt={option.imageAlt}
                />
              </Link>
            </li>
          ))}
        </Reveal>

        <p className="mt-14 text-center text-label text-muted">
          Six short questions. No payment, no account, no obligation.
        </p>
      </div>

      {/* Brand strip. Uses the company's actual tagline rather than an invented
          campaign hashtag — the device is decorative, the words should be real. */}
      <div className="relative z-[2] mt-14 border-t border-primary/25 bg-primary/10 py-5">
        <Marquee speed={38}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="flex items-center">
              <span className="mx-8 flex items-center gap-3 text-label font-semibold text-text-strong">
                <PlayMark className="size-4 text-primary" />
                {site.tagline}
              </span>
              <span aria-hidden="true" className="h-5 w-px bg-primary/30" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
