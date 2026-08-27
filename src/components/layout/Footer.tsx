import Link from "next/link";
import { navigation, site } from "@/content/site";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";
import { ContactLinks } from "./ContactLinks";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="theme-sand grain relative bg-background text-text">
      <span className="grain-layer" aria-hidden="true" />

      <div className="container-editorial relative z-[2] py-[clamp(3.5rem,7vw,6rem)]">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_2fr]">
          <div>
            <Link href="/" aria-label={`${site.name} — home`} className="inline-block text-text-strong">
              <Logo />
            </Link>
            <p className="mt-6 max-w-sm text-lede text-muted">{site.tagline}</p>

            <div className="mt-8">
              <NewsletterForm />
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {navigation.footer.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="text-caption font-semibold uppercase tracking-[0.14em] text-muted">
                  {group.title}
                </h2>
                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-label text-text/85 transition-colors duration-[--duration-fast] hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-8 border-t border-border pt-10 md:grid-cols-2">
          <ContactLinks />

          <div className="md:text-right">
            <h2 className="text-caption font-semibold uppercase tracking-[0.14em] text-muted">
              Follow the journeys
            </h2>
            <ul className="mt-4 flex gap-3 md:justify-end">
              {site.social.map((social) => (
                <li key={social.url}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center rounded-pill border border-border px-4 text-label transition-colors duration-[--duration-fast] hover:border-border-strong hover:text-primary"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 text-caption text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <p className="max-w-xl md:text-right">
            Prices shown are indicative starting points per person on twin sharing and are confirmed
            in writing before payment. Visa rules are set by the destination government and can
            change without notice.
          </p>
        </div>
      </div>
    </footer>
  );
}
