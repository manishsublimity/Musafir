"use client";

import { useEffect } from "react";

/**
 * Route error boundary. Offers a retry rather than a dead end, and never leaks
 * the underlying error text to the traveller.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO(integration): forward to the error reporter.
    console.error(error);
  }, [error]);

  return (
    <section className="theme-sand flex min-h-[100svh] items-center bg-background py-32 text-text">
      <div className="container-editorial max-w-xl">
        <p className="text-caption font-semibold uppercase tracking-[0.16em] text-primary">
          Something went wrong
        </p>
        <h1 className="mt-6 text-h1">Your journey hit a small pause.</h1>
        <p className="mt-6 text-lede text-muted">
          This page did not load properly. It is usually temporary — try again, and if it keeps
          happening, tell us and we will look into it.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-14 items-center rounded-pill bg-primary px-8 text-body font-semibold text-primary-contrast transition-[filter] hover:brightness-110"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex h-14 items-center rounded-pill border border-border-strong px-8 text-body font-semibold"
          >
            Back to the homepage
          </a>
        </div>

        {error.digest && (
          <p className="mt-8 text-caption text-muted">Reference: {error.digest}</p>
        )}
      </div>
    </section>
  );
}
