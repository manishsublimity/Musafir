"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PackageCard } from "@/components/cards/PackageCard";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Primitives";
import { track } from "@/lib/analytics";
import type { PackageCard as PackageCardData } from "@/lib/view-models";
import { cx } from "@/lib/utils";

/**
 * TRIP MATCHER
 *
 * A transparent recommendation engine. Every result carries the reasons it was
 * chosen, because "we found these for you" is only reassuring if the traveller
 * can see the reasoning — an opaque ranking on a five-figure purchase reads as
 * a sales tactic rather than as help.
 *
 * Scoring is deliberately simple and lives here rather than on a server: the
 * whole point is that changing an answer re-ranks instantly.
 */

export interface MatchablePackage extends PackageCardData {
  match: { styles: string[]; days: number; price: number; featured: boolean };
}

const COMPANIONS = [
  { id: "couple", label: "Couple" },
  { id: "family", label: "Family" },
  { id: "friends", label: "Friends" },
  { id: "solo", label: "Solo" },
];

const INTERESTS = [
  { id: "relaxation", label: "Relaxation", styles: ["beach", "luxury", "senior-friendly"] },
  { id: "adventure", label: "Adventure", styles: ["adventure", "friends"] },
  { id: "culture", label: "Culture", styles: ["cultural", "family"] },
  { id: "luxury", label: "Luxury", styles: ["luxury", "honeymoon"] },
  { id: "nature", label: "Nature", styles: ["wildlife", "adventure"] },
  { id: "shopping", label: "Shopping", styles: ["family", "friends", "weekend"] },
];

const DURATIONS = [
  { id: "3-5", label: "3 – 5 days", range: [3, 5] as [number, number] },
  { id: "6-8", label: "6 – 8 days", range: [6, 8] as [number, number] },
  { id: "9-12", label: "9 – 12 days", range: [9, 12] as [number, number] },
  { id: "12-plus", label: "12+ days", range: [12, 40] as [number, number] },
];

const BUDGETS = [
  { id: "under-50k", label: "Under ₹50K", max: 50000 },
  { id: "50k-1l", label: "₹50K – ₹1L", max: 100000 },
  { id: "1l-2l", label: "₹1L – ₹2L", max: 200000 },
  { id: "2l-plus", label: "₹2L+", max: Number.POSITIVE_INFINITY },
];

export function TripMatcher({ packages }: { packages: MatchablePackage[] }) {
  const params = useSearchParams();

  const [companion, setCompanion] = useState<string>(params.get("style") ?? "");
  const [interests, setInterests] = useState<string[]>([]);
  const [duration, setDuration] = useState<string>("");
  const [budget, setBudget] = useState<string>(params.get("budget") ?? "");

  const answered = [companion, interests.length ? "y" : "", duration, budget].filter(Boolean).length;

  const results = useMemo(() => {
    if (answered === 0) return [];

    const ceiling = BUDGETS.find((b) => b.id === budget)?.max ?? Number.POSITIVE_INFINITY;
    const range = DURATIONS.find((d) => d.id === duration)?.range;
    const wanted = new Set<string>();
    if (companion) wanted.add(companion);
    for (const id of interests) {
      for (const style of INTERESTS.find((i) => i.id === id)?.styles ?? []) wanted.add(style);
    }

    return packages
      .map((pkg) => {
        let score = 0;
        const reasons: string[] = [];

        if (budget) {
          if (pkg.match.price <= ceiling) {
            score += 3;
            reasons.push("Within your budget");
          } else {
            score -= 5;
          }
        }

        if (range) {
          if (pkg.match.days >= range[0] && pkg.match.days <= range[1]) {
            score += 3;
            reasons.push(`${pkg.match.days} days, the length you asked for`);
          } else {
            score -= Math.min(3, Math.abs(pkg.match.days - range[1]) / 2);
          }
        }

        const matched = pkg.match.styles.filter((s) => wanted.has(s));
        if (matched.length) {
          score += matched.length * 2;
          reasons.push(`Suits ${matched.slice(0, 2).join(" and ")} travel`);
        }

        if (pkg.match.featured) score += 0.5;

        return { pkg, reasons, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [packages, companion, interests, duration, budget, answered]);

  function toggleInterest(id: string) {
    setInterests((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  }

  return (
    <div className="mt-14">
      <div className="space-y-10">
        <Question label="Who are you travelling with?">
          {COMPANIONS.map((c) => (
            <Chip
              key={c.id}
              selected={companion === c.id}
              onClick={() => setCompanion(companion === c.id ? "" : c.id)}
            >
              {c.label}
            </Chip>
          ))}
        </Question>

        <Question label="What are you looking for?" hint="Pick as many as apply">
          {INTERESTS.map((i) => (
            <Chip key={i.id} selected={interests.includes(i.id)} onClick={() => toggleInterest(i.id)}>
              {i.label}
            </Chip>
          ))}
        </Question>

        <Question label="How long do you have?">
          {DURATIONS.map((d) => (
            <Chip
              key={d.id}
              selected={duration === d.id}
              onClick={() => setDuration(duration === d.id ? "" : d.id)}
            >
              {d.label}
            </Chip>
          ))}
        </Question>

        <Question label="Budget per person">
          {BUDGETS.map((b) => (
            <Chip
              key={b.id}
              selected={budget === b.id}
              onClick={() => setBudget(budget === b.id ? "" : b.id)}
            >
              {b.label}
            </Chip>
          ))}
        </Question>
      </div>

      <div className="mt-16 border-t border-border pt-12" aria-live="polite">
        {answered === 0 ? (
          <p className="text-lede text-muted">
            Answer a question above and matching journeys will appear here.
          </p>
        ) : results.length ? (
          <>
            <h2 className="text-h2">We found these journeys for you.</h2>
            <p className="mt-4 max-w-xl text-lede text-muted">
              Ranked against your answers — and each one shows why it made the list.
            </p>

            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map(({ pkg, reasons }) => (
                <li key={pkg.slug} className="flex flex-col">
                  <PackageCard data={pkg} className="flex-1" />
                  {reasons.length > 0 && (
                    <ul className="mt-3 space-y-1.5 rounded-md border border-border bg-surface-raised p-4">
                      {reasons.map((reason) => (
                        <li key={reason} className="flex gap-2 text-caption text-muted">
                          <svg viewBox="0 0 24 24" className="mt-0.5 size-3.5 shrink-0 text-primary" fill="none" aria-hidden="true">
                            <path d="m5 13 4.2 4.2L19 7.4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-14 rounded-lg border border-border bg-surface p-8 text-center">
              <p className="text-h3">None of these quite it?</p>
              <p className="mx-auto mt-3 max-w-md text-body text-muted">
                Every itinerary we sell started as a custom trip. Tell us what is missing.
              </p>
              <ButtonLink
                href="/enquiry"
                className="mt-7"
                arrow
                still
                onClick={() => track("enquiry_started", { source: "matcher" })}
              >
                Design mine from scratch
              </ButtonLink>
            </div>
          </>
        ) : (
          <EmptyState
            title="We couldn't find that exact journey."
            body="Nothing in the catalogue matches all of those answers at once — most often it is the budget and duration pulling against each other. Change one, or let us build something around your constraints."
            action={<ButtonLink href="/enquiry" arrow>Tell us what you want</ButtonLink>}
          />
        )}
      </div>
    </div>
  );
}

function Question({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="text-h3">{label}</legend>
      {hint && <p className="mt-2 text-label text-muted">{hint}</p>}
      <div className="mt-5 flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function Chip({
  children,
  selected,
  onClick,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cx(
        "h-12 rounded-pill border px-5 text-label font-medium transition-[background-color,border-color,color] duration-[--duration-fast] ease-[--ease-expo]",
        selected
          ? "border-primary bg-primary text-primary-contrast"
          : "border-border text-muted hover:border-border-strong hover:text-text",
      )}
    >
      {children}
    </button>
  );
}
