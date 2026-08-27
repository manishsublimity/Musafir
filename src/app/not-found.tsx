import Link from "next/link";
import { Scene } from "@/components/media/Scene";
import { ButtonLink } from "@/components/ui/Button";
import { getTrendingDestinations } from "@/lib/cms";

export const metadata = {
  title: "Page not found | Musafir Travels",
  robots: { index: false, follow: true },
};

/**
 * 404. Not a dead end — a wrong turn, with the four most likely destinations
 * offered as the way onward.
 */
export default function NotFound() {
  const suggestions = getTrendingDestinations(4);

  return (
    <section
      aria-label="Page not found"
      className="theme-sand relative isolate flex min-h-[100svh] items-center overflow-hidden bg-background py-32 text-text"
    >
      <div className="absolute inset-0 -z-10">
        <Scene scene="desert" seed="not-found" className="size-full" />
        <span aria-hidden="true" className="absolute inset-0 bg-background/85" />
      </div>

      <div className="container-editorial">
        <p className="text-caption font-semibold uppercase tracking-[0.16em] text-primary">
          Error 404
        </p>

        <h1 className="mt-6 max-w-3xl text-h1 text-text-strong">
          This one isn&rsquo;t on the map.
        </h1>

        <p className="mt-6 max-w-lg text-lede text-muted">
          The page you were looking for has moved or never existed. Here is where most people were
          heading instead.
        </p>

        <ul className="mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {suggestions.map((destination) => (
            <li key={destination.slug}>
              <Link
                href={`/destinations/${destination.slug}`}
                className="group/nf relative flex h-48 flex-col justify-end overflow-hidden rounded-lg"
              >
                <Scene
                  scene={destination.hero.scene ?? "island"}
                  palette={destination.hero.palette}
                  seed={`404-${destination.slug}`}
                  className="absolute inset-0 transition-transform duration-[900ms] ease-[--ease-expo] group-hover/nf:scale-[1.08]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-background to-transparent"
                />
                <span className="relative z-[2] p-4 text-h3 text-text-strong">{destination.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-wrap gap-3">
          <ButtonLink href="/" size="lg" arrow>
            Back to the homepage
          </ButtonLink>
          <ButtonLink href="/plan-my-trip" variant="outline" size="lg">
            Plan my trip
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
