"use client";

import { useState, type FormEvent } from "react";

type State = "idle" | "sending" | "done" | "error";

export function NewsletterForm() {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setState("sending");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(data.get("email") ?? ""),
          company: String(data.get("company") ?? ""),
          renderedAt: Number(data.get("renderedAt") ?? 0),
        }),
      });
      const body = (await response.json()) as { ok: boolean; message: string };
      setMessage(body.message);
      setState(body.ok ? "done" : "error");
      if (body.ok) form.reset();
    } catch {
      setMessage("That did not go through. Please try again, or email us directly.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p role="status" className="text-body text-secondary">
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <label htmlFor="newsletter-email" className="block text-caption font-semibold uppercase tracking-[0.14em] text-muted">
        Get travel inspiration in your inbox
      </label>

      {/* Honeypot — real people never see this, bots fill it in. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="newsletter-company">Company</label>
        <input id="newsletter-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="renderedAt" value={Date.now()} />

      <div className="mt-4 flex gap-2">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          aria-describedby={state === "error" ? "newsletter-error" : undefined}
          className="h-12 min-w-0 flex-1 rounded-pill border border-border bg-surface px-5 text-label text-text outline-none transition-colors duration-[--duration-fast] placeholder:text-muted focus-visible:border-primary"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="h-12 shrink-0 rounded-pill bg-primary px-5 text-label font-semibold text-primary-contrast transition-[filter] duration-[--duration-fast] hover:brightness-110 disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : "Subscribe"}
        </button>
      </div>

      {state === "error" && (
        <p id="newsletter-error" role="alert" className="mt-3 text-label text-clay-400">
          {message}
        </p>
      )}
      <p className="mt-3 text-caption text-muted">
        Occasional itineraries and seasonal advice. No spam, and you can unsubscribe at any time.
      </p>
    </form>
  );
}
