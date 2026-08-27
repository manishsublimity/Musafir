import { Breadcrumbs, Section } from "@/components/ui/Primitives";
import { formatDate } from "@/lib/format";
import type { PolicyDoc } from "@/content/legal";

/** Shared layout for the three policy documents. */
export function PolicyPage({ doc, href }: { doc: PolicyDoc; href: string }) {
  return (
    <div className="theme-day grain relative bg-background pt-32 text-text">
      <span className="grain-layer" aria-hidden="true" />

      <div className="container-prose relative z-[2]">
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: doc.title, href }]} />
        <h1 className="mt-8 text-h1">{doc.title}</h1>
        <p className="mt-5 text-lede text-muted">{doc.intro}</p>
        <p className="mt-4 text-label text-muted">Last updated {formatDate(doc.updated)}</p>
      </div>

      <Section theme="day" padded={false} className="py-[clamp(3rem,6vw,5rem)]">
        <div className="container-prose">
          {doc.sections.map((section) => (
            <section key={section.heading} className="mt-12 first:mt-0">
              <h2 className="text-h2">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-body text-muted">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </Section>
    </div>
  );
}
