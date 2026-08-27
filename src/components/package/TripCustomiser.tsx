"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { track } from "@/lib/analytics";
import { formatMoney } from "@/lib/format";
import { availableCategories, buildQuote } from "@/lib/pricing";
import type { HotelCategory, PricingModel } from "@/lib/types";
import { cx } from "@/lib/utils";

/**
 * "MAKE THIS TRIP YOURS"
 *
 * Every figure here comes from `buildQuote`, which derives everything from the
 * package's own `PricingModel`. Nothing is computed inline and nothing is
 * hardcoded, so what the traveller sees is what the business has actually
 * priced — and the disclaimer that ships with the model is always displayed
 * alongside it.
 */
export function TripCustomiser({
  pricing,
  packageSlug,
  baseCategory,
}: {
  pricing: PricingModel;
  packageSlug: string;
  baseCategory: HotelCategory;
}) {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [category, setCategory] = useState<HotelCategory>(baseCategory);
  const [addOnIds, setAddOnIds] = useState<string[]>([]);

  const categories = useMemo(() => availableCategories(pricing), [pricing]);

  const quote = useMemo(
    () => buildQuote(pricing, { adults, children, infants, hotelCategory: category, addOnIds }),
    [pricing, adults, children, infants, category, addOnIds],
  );

  const enquiryHref = useMemo(() => {
    const params = new URLSearchParams({
      package: packageSlug,
      adults: String(adults),
      travellers: String(adults + children + infants),
    });
    if (addOnIds.length) params.set("addons", addOnIds.join(","));
    return `/enquiry?${params.toString()}`;
  }, [packageSlug, adults, children, infants, addOnIds]);

  function toggleAddOn(id: string) {
    setAddOnIds((prev) => {
      const next = prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id];
      track("add_activity_clicked", { package: packageSlug, addOn: id, on: !prev.includes(id) });
      return next;
    });
  }

  const grouped = useMemo(() => {
    const groups: Record<string, typeof pricing.addOns> = {};
    for (const addOn of pricing.addOns) {
      (groups[addOn.group] ??= []).push(addOn);
    }
    return groups;
  }, [pricing.addOns]);

  const GROUP_LABELS: Record<string, string> = {
    hotel: "Stay",
    room: "Room",
    activity: "Experiences",
    transfer: "Transfers",
    flight: "Flights",
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_23rem] lg:items-start">
      <div className="min-w-0 space-y-8">
        <fieldset>
          <legend className="text-caption font-semibold uppercase tracking-[0.14em] text-muted">
            Travellers
          </legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Stepper label="Adults" value={adults} min={1} onChange={setAdults} />
            <Stepper label="Children" value={children} min={0} onChange={setChildren} />
            <Stepper label="Infants" value={infants} min={0} onChange={setInfants} />
          </div>
        </fieldset>

        {categories.length > 1 && (
          <fieldset>
            <legend className="text-caption font-semibold uppercase tracking-[0.14em] text-muted">
              Hotel category
            </legend>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={category === c}
                  onClick={() => {
                    setCategory(c);
                    track("customize_option_changed", { package: packageSlug, category: c });
                  }}
                  className={cx(
                    "h-11 rounded-pill border px-4 text-label font-medium capitalize transition-colors duration-[--duration-fast]",
                    category === c
                      ? "border-primary bg-primary text-primary-contrast"
                      : "border-border text-muted hover:border-border-strong hover:text-text",
                  )}
                >
                  {c.replace("-", " ")}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {Object.entries(grouped).map(([group, addOns]) => (
          <fieldset key={group}>
            <legend className="text-caption font-semibold uppercase tracking-[0.14em] text-muted">
              {GROUP_LABELS[group] ?? group}
            </legend>
            <ul className="mt-4 space-y-3">
              {addOns.map((addOn) => {
                const selected = addOnIds.includes(addOn.id);
                const free = addOn.price.amount === 0;
                return (
                  <li key={addOn.id}>
                    <label
                      className={cx(
                        "flex cursor-pointer items-start gap-4 rounded-md border p-4 transition-colors duration-[--duration-fast]",
                        selected ? "border-primary bg-primary/6" : "border-border hover:border-border-strong",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleAddOn(addOn.id)}
                        className="sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={cx(
                          "mt-0.5 grid size-5 shrink-0 place-items-center rounded-sm border transition-colors duration-[--duration-fast]",
                          selected
                            ? "border-primary bg-primary text-primary-contrast"
                            : "border-border-strong",
                        )}
                      >
                        {selected && (
                          <svg viewBox="0 0 24 24" className="size-3.5" fill="none">
                            <path
                              d="m5 13 4.2 4.2L19 7.4"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold">{addOn.label}</span>
                        {addOn.description && (
                          <span className="mt-1 block text-label text-muted">{addOn.description}</span>
                        )}
                      </span>

                      <span className="shrink-0 text-label font-semibold">
                        {free ? "No extra cost" : `+ ${formatMoney(addOn.price)}`}
                        {!free && !addOn.perBooking && (
                          <span className="block text-caption font-normal text-muted">per person</span>
                        )}
                        {addOn.perBooking && (
                          <span className="block text-caption font-normal text-muted">per booking</span>
                        )}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        ))}
      </div>

      {/* ------------------------------------------------------ live quote */}
      <aside className="sticky top-24 rounded-lg border border-border bg-surface p-6">
        <p className="text-caption font-semibold uppercase tracking-[0.14em] text-muted">
          Your price
        </p>

        <dl className="mt-5 space-y-3 text-label" aria-live="polite">
          {quote.base.map((line) => (
            <Line key={line.id} label={line.label} detail={line.detail} amount={line.amount} />
          ))}

          {quote.addOns.length > 0 && (
            <>
              <li className="!mt-5 list-none border-t border-border pt-4 text-caption uppercase tracking-[0.12em] text-muted">
                Add-ons
              </li>
              {quote.addOns.map((line) => (
                <Line key={line.id} label={line.label} detail={line.detail} amount={line.amount} />
              ))}
            </>
          )}

          <div className="!mt-5 flex items-baseline justify-between border-t border-border pt-4">
            <dt className="text-muted">Subtotal</dt>
            <dd className="font-semibold tabular-nums">
              {formatMoney({ amount: quote.subtotal, currency: quote.currency })}
            </dd>
          </div>
          <div className="flex items-baseline justify-between">
            <dt className="text-muted">{quote.taxLabel}</dt>
            <dd className="font-semibold tabular-nums">
              {formatMoney({ amount: quote.tax, currency: quote.currency })}
            </dd>
          </div>
        </dl>

        <div className="mt-5 border-t border-border pt-5">
          <p className="flex items-baseline justify-between">
            <span className="text-label text-muted">Total</span>
            <span className="text-price font-semibold text-text-strong tabular-nums">
              {formatMoney({ amount: quote.total, currency: quote.currency })}
            </span>
          </p>
          <p className="mt-1.5 text-caption text-muted">
            {formatMoney({ amount: quote.perPerson, currency: quote.currency })} per person ·{" "}
            {quote.travellers} travelling
          </p>
        </div>

        <Link
          href={enquiryHref}
          data-cta
          onClick={() => track("booking_started", { package: packageSlug, total: quote.total })}
          className="mt-6 flex h-14 items-center justify-center gap-2 rounded-pill bg-primary text-body font-semibold text-primary-contrast transition-[filter] duration-[--duration-fast] hover:brightness-110"
        >
          Book this trip
          <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
            <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        <p className="mt-5 text-caption leading-relaxed text-muted">{quote.disclaimer}</p>
      </aside>
    </div>
  );
}

function Line({
  label,
  detail,
  amount,
}: {
  label: string;
  detail?: string;
  amount: number;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="min-w-0">
        <span className="block">{label}</span>
        {detail && <span className="block text-caption text-muted">{detail}</span>}
      </dt>
      <dd className="shrink-0 font-semibold tabular-nums">
        {formatMoney({ amount, currency: "INR" })}
      </dd>
    </div>
  );
}

function Stepper({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <span className="block text-label text-muted">{label}</span>
      <div className="mt-2 flex h-12 items-center justify-between rounded-md border border-border bg-surface px-2">
        <button
          type="button"
          aria-label={`Fewer ${label.toLowerCase()}`}
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="grid size-9 place-items-center rounded-full border border-border text-lede leading-none disabled:opacity-30"
        >
          −
        </button>
        <output className="text-label font-semibold tabular-nums">{value}</output>
        <button
          type="button"
          aria-label={`More ${label.toLowerCase()}`}
          onClick={() => onChange(Math.min(20, value + 1))}
          className="grid size-9 place-items-center rounded-full border border-border text-lede leading-none"
        >
          +
        </button>
      </div>
    </div>
  );
}
