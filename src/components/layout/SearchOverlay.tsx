"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { SearchResult } from "@/lib/cms";
import { track } from "@/lib/analytics";
import { cx } from "@/lib/utils";

const SUGGESTIONS = [
  "7 day Bali honeymoon",
  "family trip under ₹1 lakh",
  "Kashmir in December",
  "visa free destinations",
  "Australia",
];

const KIND_LABEL: Record<SearchResult["kind"], string> = {
  destination: "Destination",
  package: "Package",
  experience: "Experience",
  guide: "Guide",
};

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      // Focus trap: the overlay is modal, so Tab must not escape it.
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as { results: SearchResult[] };
        setResults(data.results);
        track("search_performed", { query: trimmed, results: data.results.length });
      } catch {
        // An aborted request is the normal case while typing, not an error.
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query, open]);

  if (!open) return null;

  return (
    <div
      className="theme-sand fixed inset-0 z-[120] flex justify-center bg-background/85 px-4 pt-[12vh] backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label="Search Musafir Travels"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div ref={dialogRef} className="w-full max-w-2xl">
        <div className="flex items-center gap-3 rounded-lg border border-border-strong bg-surface px-5">
          <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-muted" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
            <path d="m20 20-3.6-3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Where to? Try “7 day Bali honeymoon”"
            aria-label="Search destinations, packages, experiences and guides"
            className="h-16 w-full bg-transparent text-lede text-text outline-none placeholder:text-muted"
          />
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-pill border border-border px-3 py-1 text-caption font-semibold uppercase tracking-[0.1em] text-muted transition-colors hover:text-text"
          >
            Esc
          </button>
        </div>

        <div className="mt-4 max-h-[52vh] overflow-y-auto rounded-lg border border-border bg-surface">
          {query.trim().length < 2 ? (
            <div className="p-6">
              <p className="text-caption font-semibold uppercase tracking-[0.14em] text-muted">
                Try searching for
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => setQuery(s)}
                      className="rounded-pill border border-border px-3.5 py-2 text-label text-muted transition-colors hover:border-border-strong hover:text-text"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : loading && !results.length ? (
            <ul className="divide-y divide-[--color-border]">
              {[0, 1, 2].map((i) => (
                <li key={i} className="flex items-center gap-4 p-5">
                  <span className="h-3 w-14 animate-pulse rounded-pill bg-surface-raised" />
                  <span className="h-3 flex-1 animate-pulse rounded-pill bg-surface-raised" />
                </li>
              ))}
            </ul>
          ) : results.length ? (
            <ul className="divide-y divide-[--color-border]">
              {results.map((result) => (
                <li key={`${result.kind}-${result.href}`}>
                  <Link
                    href={result.href}
                    onClick={onClose}
                    className="flex items-center gap-4 p-5 transition-colors hover:bg-surface-raised"
                  >
                    <span
                      className={cx(
                        "w-24 shrink-0 text-caption font-semibold uppercase tracking-[0.1em]",
                        result.kind === "package" ? "text-primary" : "text-muted",
                      )}
                    >
                      {KIND_LABEL[result.kind]}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-text">{result.title}</span>
                      <span className="block truncate text-label text-muted">{result.subtitle}</span>
                    </span>
                    {result.meta && (
                      <span className="shrink-0 text-label text-muted">{result.meta}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-10 text-center">
              <p className="text-h3">Nothing matched that yet.</p>
              <p className="mx-auto mt-3 max-w-sm text-body text-muted">
                Try a destination, a number of days, or a budget — “6 days Kerala”, “under ₹50k”.
              </p>
              <Link
                href="/plan-my-trip"
                onClick={onClose}
                className="mt-6 inline-block font-semibold text-primary underline underline-offset-4"
              >
                Or tell us what you are looking for
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
