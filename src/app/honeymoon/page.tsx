import type { Metadata } from "next";
import { Scene } from "@/components/media/Scene";
import { Parallax } from "@/components/motion/Parallax";
import { SplitText } from "@/components/motion/SplitText";
import { PackageExplorer } from "@/components/package/PackageExplorer";
import { Breadcrumbs, Section } from "@/components/ui/Primitives";
import { getHoneymoonPackages } from "@/lib/cms";
import { metadataFrom } from "@/lib/seo";
import { toPackageCard } from "@/lib/view-models";

export const metadata: Metadata = metadataFrom({
  title: "Honeymoon Packages | Musafir Travels",
  description:
    "Honeymoon packages to the Maldives, Bali, Mauritius, Switzerland, Kerala and more — private-pool villas, overwater stays and the three details that actually decide how the trip feels.",
  canonical: "/honeymoon",
  keywords: ["honeymoon packages from india", "maldives honeymoon package", "bali honeymoon package"],
});

export default function HoneymoonPage() {
  const packages = getHoneymoonPackages().map(toPackageCard);

  return (
    <>
      <section
        aria-label="Honeymoon packages"
        className="theme-sand relative isolate flex min-h-[72svh] flex-col justify-end overflow-hidden bg-background pb-14 pt-32 text-text"
      >
        <Parallax speed={0.3} className="absolute inset-0 -z-10" overscan>
          <Scene scene="island" seed="honeymoon-page" className="size-full" />
        </Parallax>
        <span aria-hidden="true" className="absolute inset-0 -z-10 bg-background/80" />

        <div className="container-editorial">
          <Breadcrumbs
            trail={[{ name: "Home", href: "/" }, { name: "Honeymoon", href: "/honeymoon" }]}
            className="text-muted"
          />

          <SplitText
            as="h1"
            immediate
            lines={["For the beginning", "of your forever."]}
            className="mt-8 max-w-3xl text-h1 text-text-strong"
          />

          <p className="mt-7 max-w-xl text-lede text-muted">
            We spend most of the planning on three things that decide how a honeymoon actually
            feels: the room, the transfer, and how many days you leave with nothing scheduled.
          </p>
        </div>
      </section>

      <Section theme="day" padded={false} className="pb-[clamp(4rem,8vw,7rem)] pt-4">
        <div className="container-editorial">
          <PackageExplorer packages={packages} />
        </div>
      </Section>
    </>
  );
}
