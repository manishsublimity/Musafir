"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { navigation, site } from "@/content/site";
import { track } from "@/lib/analytics";
import { cx } from "@/lib/utils";
import { Magnetic } from "@/components/motion/Magnetic";
import { Logo } from "./Logo";
import { SearchOverlay } from "./SearchOverlay";

/**
 * The navigation overlays the hero on first paint and gradually acquires a
 * surface as the page scrolls — the transition is driven by a single scroll
 * threshold rather than a scrub, so it costs one class change rather than a
 * style write per frame.
 */
export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  /** True when the content directly under the unscrolled nav is dark. */
  const [overDarkHero, setOverDarkHero] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /**
   * The nav sits over the page rather than above it, so its own colours have to
   * follow whatever is underneath. Rather than annotating every page, the top
   * section's background luminance is measured on each route change — pages
   * with a cinematic dark hero get cream text, editorial light pages get ink.
   */
  useEffect(() => {
    const measure = () => {
      const first = document.querySelector<HTMLElement>("main > *, main section");
      if (!first) return;

      const background = getComputedStyle(first).backgroundColor;
      const match = background.match(/rgba?\(([^)]+)\)/);
      if (!match) return;

      const parts = match[1].split(",").map((v) => parseFloat(v));
      const [r, g, b] = parts;
      const alpha = parts.length > 3 ? parts[3] : 1;
      // A transparent top section means media is showing through, which on this
      // site always means a dark cinematic hero.
      if (alpha < 0.5) {
        setOverDarkHero(true);
        return;
      }
      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      setOverDarkHero(luminance < 0.5);
    };

    measure();
    // Re-measure after hydration settles, in case the first paint was a skeleton.
    const id = window.setTimeout(measure, 300);
    return () => window.clearTimeout(id);
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Cmd/Ctrl-K opens search, as people now expect it to.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <>
      <header
        data-tone={scrolled || overDarkHero ? "dark" : "light"}
        className={cx(
          "fixed inset-x-0 top-0 z-[100] transition-[background-color,backdrop-filter,box-shadow,border-color] duration-[--duration-base] ease-[--ease-expo]",
          scrolled
            ? "theme-sand border-b border-border bg-background/85 backdrop-blur-xl"
            : overDarkHero
              ? "theme-sand border-b border-transparent bg-gradient-to-b from-background/60 to-transparent"
              : "theme-day border-b border-border/60 bg-background/80 backdrop-blur-xl",
        )}
      >
        <div
          className={cx(
            "container-editorial flex items-center justify-between transition-[height] duration-[--duration-base] ease-[--ease-expo]",
            scrolled ? "h-16" : "h-20 md:h-24",
          )}
        >
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            className="transition-opacity hover:opacity-80"
          >
            <Logo compact={scrolled} tone={scrolled || overDarkHero ? "light" : "dark"} />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navigation.primary.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cx(
                        "group/nav relative block px-3.5 py-2 text-label font-medium text-text/85 transition-colors duration-[--duration-fast] hover:text-text",
                        active && "text-text",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cx(
                          "absolute inset-x-3.5 bottom-1 h-px origin-right scale-x-0 bg-primary transition-transform duration-[--duration-base] ease-[--ease-expo] group-hover/nav:origin-left group-hover/nav:scale-x-100",
                          active && "scale-x-100",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="grid size-10 place-items-center rounded-full text-text/85 transition-colors hover:bg-text/10 hover:text-text"
            >
              <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
                <path d="m20 20-3.6-3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </button>

            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_clicked", { source: "nav" })}
              aria-label={`Message ${site.name} on WhatsApp`}
              className="hidden size-10 place-items-center rounded-full text-text/85 transition-colors hover:bg-text/10 hover:text-text sm:grid"
            >
              <svg viewBox="0 0 24 24" className="size-[19px]" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.24h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.1.81.83-3.02-.2-.31a8.24 8.24 0 1 1 6.97 3.85Zm4.5-6.17c-.25-.12-1.46-.72-1.68-.8-.23-.09-.39-.13-.55.12s-.64.8-.78.97c-.14.16-.29.18-.53.06a6.7 6.7 0 0 1-3.35-2.93c-.25-.43.25-.4.72-1.33.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.47-.4-.4-.55-.41h-.47c-.16 0-.42.06-.64.3-.22.25-.84.83-.84 2.01s.86 2.33.98 2.5c.12.15 1.7 2.58 4.1 3.62 1.53.66 2.13.72 2.9.6.46-.06 1.46-.59 1.67-1.17.2-.58.2-1.07.15-1.17-.06-.11-.22-.17-.47-.29Z" />
              </svg>
            </a>

            <Magnetic strength={8}>
              <Link
                href="/plan-my-trip"
                data-cta
                onClick={() => track("plan_trip_clicked", { source: "nav" })}
                className="hidden h-11 items-center rounded-pill border border-border-strong px-5 text-label font-semibold text-text transition-colors duration-[--duration-fast] hover:bg-text/10 md:inline-flex"
              >
                Plan my trip
              </Link>
            </Magnetic>

            <Magnetic strength={10}>
              <Link
                href="/enquiry"
                data-cta
                className="hidden h-11 items-center rounded-pill bg-primary px-5 text-label font-semibold text-primary-contrast transition-[filter] duration-[--duration-fast] hover:brightness-110 sm:inline-flex"
              >
                Enquire
              </Link>
            </Magnetic>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="grid size-10 place-items-center rounded-full text-text transition-colors hover:bg-text/10 lg:hidden"
            >
              <span className="relative block h-3 w-5">
                <span
                  className={cx(
                    "absolute inset-x-0 h-px bg-current transition-all duration-[--duration-base] ease-[--ease-expo]",
                    menuOpen ? "top-1.5 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cx(
                    "absolute inset-x-0 h-px bg-current transition-all duration-[--duration-base] ease-[--ease-expo]",
                    menuOpen ? "top-1.5 -rotate-45" : "top-3",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={closeSearch} />
    </>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      id="mobile-menu"
      hidden={!open}
      className="theme-sand fixed inset-0 z-[95] flex flex-col bg-background pt-20 lg:hidden"
    >
      <nav aria-label="Mobile" className="container-editorial flex-1 overflow-y-auto pb-8">
        <ul className="divide-y divide-[--color-border]">
          {navigation.primary.map((item, i) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className="flex items-center justify-between py-5 text-h3"
                style={{
                  animation: open
                    ? `musafir-drift 0s, none`
                    : undefined,
                  transitionDelay: `${i * 40}ms`,
                }}
              >
                {item.label}
                <svg viewBox="0 0 24 24" className="size-5 text-muted" fill="none" aria-hidden="true">
                  <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 grid gap-3">
          <Link
            href="/plan-my-trip"
            data-cta
            onClick={onClose}
            className="flex h-14 items-center justify-center rounded-pill bg-primary text-body font-semibold text-primary-contrast"
          >
            Plan my trip
          </Link>
          <Link
            href="/enquiry"
            data-cta
            onClick={onClose}
            className="flex h-14 items-center justify-center rounded-pill border border-border-strong text-body font-semibold"
          >
            Enquire
          </Link>
        </div>

        <div className="mt-8 grid gap-1 text-label text-muted">
          <a href={`tel:${site.phone}`} onClick={() => track("call_clicked", { source: "mobile-menu" })} className="py-2">
            {site.phoneDisplay}
          </a>
          <a href={`mailto:${site.email}`} className="py-2">
            {site.email}
          </a>
        </div>
      </nav>
    </div>
  );
}
