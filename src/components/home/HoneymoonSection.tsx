import Link from "next/link";
import { Scene } from "@/components/media/Scene";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { ButtonLink } from "@/components/ui/Button";
import { formatMoney } from "@/lib/format";
import type { PackageCard } from "@/lib/view-models";

/**
 * SECTION 10 — HONEYMOON
 *
 * Motion identity: *slow parallax*. Everything here moves more slowly than the
 * rest of the page — a deep parallax backdrop, a long editorial reveal, wide
 * spacing. It is the only section that deliberately reduces the tempo.
 */
export function HoneymoonSection({ packages }: { packages: PackageCard[] }) {
  return (
    <section
      aria-label="Honeymoon packages"
      className="theme-sand relative isolate overflow-hidden bg-background text-text"
    >
      <Parallax speed={0.35} className="absolute inset-0 -z-10" overscan>
        <Scene scene="island" seed="honeymoon-backdrop" className="size-full" />
      </Parallax>
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-background/85" />

      <div className="container-editorial py-[clamp(5rem,11vw,10rem)]">
        <div className="max-w-3xl">
          <p className="flex items-center gap-3 text-caption font-semibold uppercase tracking-[0.16em] text-muted">
            <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
            Honeymoons
          </p>

          <SplitText
            lines={["For the beginning", "of your forever."]}
            className="mt-7 text-h1 text-text-strong"
          />

          <p className="mt-8 max-w-xl text-lede text-muted">
            The trip you will describe more than any other. We spend most of the planning on the
            three things that actually decide how it feels — the room, the transfer, and how many
            days you leave with nothing scheduled.
          </p>
        </div>

        {packages.length > 0 && (
          <Reveal variant="rise" stagger className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {packages.slice(0, 4).map((pkg) => (
              <Link
                key={pkg.slug}
                href={pkg.href}
                className="group/hm relative flex h-[clamp(22rem,34vw,28rem)] flex-col justify-end overflow-hidden rounded-lg"
              >
                <div className="absolute inset-0 transition-transform duration-[1000ms] ease-[--ease-expo] group-hover/hm:scale-[1.07]">
                  <Scene
                    scene={pkg.scene}
                    palette={pkg.palette}
                    seed={`hm-${pkg.slug}`}
                    className="size-full"
                  />
                </div>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent"
                />

                <div className="relative z-[2] p-6">
                  <p className="text-caption font-semibold uppercase tracking-[0.14em] text-muted">
                    {pkg.destinationName}
                  </p>
                  <h3 className="mt-2 text-h3 leading-tight text-text-strong">{pkg.title}</h3>

                  <dl className="mt-4 space-y-1.5 border-t border-border pt-4 text-label text-muted">
                    <Row label="Duration" value={`${pkg.days} days`} />
                    <Row label="Stay" value={pkg.hotelCategory.replace("-", " ")} />
                    <Row
                      label="From"
                      value={formatMoney({ amount: pkg.startingPrice, currency: "INR" })}
                      emphasis
                    />
                  </dl>
                </div>
              </Link>
            ))}
          </Reveal>
        )}

        <div className="mt-14 flex flex-wrap gap-3">
          <ButtonLink href="/honeymoon" size="lg" arrow>
            Explore honeymoon packages
          </ButtonLink>
          <ButtonLink href="/plan-my-trip?style=honeymoon" variant="outline" size="lg">
            Design ours from scratch
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="opacity-70">{label}</dt>
      <dd className={emphasis ? "font-semibold capitalize text-primary" : "font-medium capitalize"}>
        {value}
      </dd>
    </div>
  );
}
