"use client";

import { site } from "@/content/site";
import { track } from "@/lib/analytics";

/** Split out as a client component so the footer itself stays a server component. */
export function ContactLinks() {
  return (
    <div>
      <h2 className="text-caption font-semibold uppercase tracking-[0.14em] text-muted">
        Talk to a trip designer
      </h2>
      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
        <li>
          <a
            href={`tel:${site.phone}`}
            onClick={() => track("call_clicked", { source: "footer" })}
            className="text-lede font-semibold transition-colors duration-[--duration-fast] hover:text-primary"
          >
            {site.phoneDisplay}
          </a>
        </li>
        <li>
          <a
            href={`https://wa.me/${site.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_clicked", { source: "footer" })}
            className="text-lede font-semibold transition-colors duration-[--duration-fast] hover:text-primary"
          >
            WhatsApp
          </a>
        </li>
        <li>
          <a
            href={`mailto:${site.email}`}
            className="text-lede font-semibold transition-colors duration-[--duration-fast] hover:text-primary"
          >
            {site.email}
          </a>
        </li>
      </ul>
    </div>
  );
}
