"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { track } from "@/lib/analytics";
import { cx } from "@/lib/utils";

/**
 * ENQUIRY — the single submission point in the product.
 *
 * Everything that collects a preference elsewhere (the planner, the
 * customiser, the package customiser) funnels here with query parameters, so
 * there is exactly one endpoint to validate, rate-limit and protect.
 *
 * Four short steps rather than one long form: travellers, dates, preferences,
 * review. Progress is explicit, and nothing is submitted until the last step.
 */

const STEPS = ["Traveller details", "Travel dates", "Preferences", "Review"] as const;

const BUDGETS = [
  { id: "under-50k", label: "Under ₹50K" },
  { id: "50k-1l", label: "₹50K – ₹1L" },
  { id: "1l-2l", label: "₹1L – ₹2L" },
  { id: "2l-plus", label: "₹2L+" },
];

interface Result {
  ok: boolean;
  message: string;
  reference?: string;
  fieldErrors?: Record<string, string>;
}

export function EnquiryForm({
  destinations,
}: {
  destinations: { slug: string; name: string }[];
}) {
  const params = useSearchParams();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [renderedAt] = useState(() => Date.now());

  // Pre-fill from whatever handed us here, so the traveller never re-answers
  // a question they have already answered.
  const [form, setForm] = useState(() => ({
    name: "",
    email: "",
    phone: "",
    destinationSlug: "",
    packageSlug: "",
    startDate: "",
    endDate: "",
    adults: 2,
    children: 0,
    infants: 0,
    style: "",
    budgetBand: "",
    interests: [] as string[],
    message: "",
  }));

  useEffect(() => {
    // The hero trip starter encodes each room as "<adults>a<children>c", so a
    // family in two rooms arrives as "2a1c,2a0c". Summing gives us the head
    // count for the counters; the room split itself goes into the notes, since
    // this form has no field for it and dropping it would lose a real answer.
    const roomCodes = params.get("rooms")?.split(",").filter(Boolean) ?? [];
    const heads = roomCodes.reduce(
      (total, code) => {
        const m = /^(\d+)a(\d+)c$/.exec(code);
        return m
          ? { adults: total.adults + Number(m[1]), children: total.children + Number(m[2]) }
          : total;
      },
      { adults: 0, children: 0 },
    );

    // Duration arrives as a band ("6-8"), not a number of nights. We carry it
    // as a note rather than computing a return date, because picking one date
    // out of a range would be inventing an answer the traveller never gave.
    const notes = [
      params.get("cities") &&
        `Cities I'd like to include: ${params
          .get("cities")!
          .split(",")
          // Only the slug survives the URL, so title-case it back into
          // something a trip designer reads as a place name.
          .map((c) =>
            (c.split(":").pop() ?? "")
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" "),
          )
          .join(", ")}`,
      roomCodes.length > 1 && `Rooms: ${roomCodes.length}`,
      params.get("duration") && `Trip length: around ${params.get("duration")} days`,
    ].filter(Boolean) as string[];

    setForm((prev) => ({
      ...prev,
      destinationSlug: params.get("destination") ?? prev.destinationSlug,
      packageSlug: params.get("package") ?? prev.packageSlug,
      startDate: params.get("date") ?? params.get("start") ?? prev.startDate,
      adults:
        Number(params.get("travellers") ?? params.get("adults")) ||
        (heads.adults > 0 ? heads.adults : prev.adults),
      children: heads.adults > 0 ? heads.children : prev.children,
      style: params.get("style") ?? params.get("travelWith")?.toLowerCase() ?? prev.style,
      budgetBand: params.get("budget") ?? prev.budgetBand,
      interests: params.get("vibe")?.split(",").filter(Boolean).map((v) => v.toLowerCase()) ?? prev.interests,
      message: notes.length ? notes.join("\n") : prev.message,
    }));
  }, [params]);

  useEffect(() => {
    track("enquiry_started", { source: params.get("destination") ?? "direct" });
  }, [params]);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (form.name.trim().length < 2) e.name = "Please tell us your name";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "Enter a valid email address";
      if (!/^(\+?\d{1,3})?[\d\s()-]{7,14}$/.test(form.phone)) e.phone = "Enter a valid phone number";
    }
    if (step === 1 && form.startDate && form.endDate && form.endDate < form.startDate) {
      e.endDate = "Return date cannot be before departure";
    }
    return e;
  }, [step, form]);

  const canAdvance = Object.keys(errors).length === 0;

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          destinationSlug: form.destinationSlug || undefined,
          packageSlug: form.packageSlug || undefined,
          startDate: form.startDate || undefined,
          endDate: form.endDate || undefined,
          travellers: { adults: form.adults, children: form.children, infants: form.infants },
          style: form.style || undefined,
          budgetBand: form.budgetBand || undefined,
          interests: form.interests.length ? form.interests : undefined,
          message: form.message || undefined,
          company: "",
          renderedAt,
        }),
      });
      const body = (await response.json()) as Result;
      setResult(body);
      if (body.ok) track("enquiry_completed", { destination: form.destinationSlug });
    } catch {
      setResult({ ok: false, message: "Your journey hit a small pause. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (result?.ok) {
    return (
      <div className="mx-auto max-w-xl rounded-lg border border-border bg-surface p-10 text-center">
        <p className="text-h2">Thank you.</p>
        <p className="mt-5 text-lede text-muted">{result.message}</p>
        {result.reference && (
          <p className="mt-6 inline-block rounded-pill border border-border px-4 py-2 text-label">
            Reference <strong className="font-semibold">{result.reference}</strong>
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="mx-auto max-w-2xl">
      {/* Progress */}
      <ol className="flex items-center gap-2" aria-label="Enquiry progress">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 flex-col gap-2">
            <span
              className={cx(
                "h-1.5 rounded-pill transition-colors duration-[--duration-base]",
                i <= step ? "bg-primary" : "bg-border-strong",
              )}
            />
            <span
              className={cx(
                "text-caption uppercase tracking-[0.1em]",
                i === step ? "text-text" : "text-muted",
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
          </li>
        ))}
      </ol>

      <h2 className="mt-8 text-h2">{STEPS[step]}</h2>

      {/* Honeypot — invisible to people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="enquiry-company">Company</label>
        <input id="enquiry-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-8 space-y-6">
        {step === 0 && (
          <>
            <Field label="Your name" id="enq-name" error={errors.name}>
              <input
                id="enq-name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                autoComplete="name"
                className={inputClass}
              />
            </Field>
            <Field label="Email" id="enq-email" error={errors.email}>
              <input
                id="enq-email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                autoComplete="email"
                className={inputClass}
              />
            </Field>
            <Field label="Phone (with country code)" id="enq-phone" error={errors.phone}>
              <input
                id="enq-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                autoComplete="tel"
                placeholder="+91 98765 43210"
                className={inputClass}
              />
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Departure date" id="enq-start">
                <input
                  id="enq-start"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => update("startDate", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Return date" id="enq-end" error={errors.endDate}>
                <input
                  id="enq-end"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => update("endDate", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            <fieldset>
              <legend className="text-caption font-semibold uppercase tracking-[0.14em] text-muted">
                Travellers
              </legend>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <Counter label="Adults" value={form.adults} min={1} onChange={(v) => update("adults", v)} />
                <Counter label="Children" value={form.children} min={0} onChange={(v) => update("children", v)} />
                <Counter label="Infants" value={form.infants} min={0} onChange={(v) => update("infants", v)} />
              </div>
            </fieldset>
          </>
        )}

        {step === 2 && (
          <>
            <Field label="Destination" id="enq-destination">
              <select
                id="enq-destination"
                value={form.destinationSlug}
                onChange={(e) => update("destinationSlug", e.target.value)}
                className={inputClass}
              >
                <option value="">Not decided yet</option>
                {destinations.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name}
                  </option>
                ))}
              </select>
            </Field>

            <fieldset>
              <legend className="text-caption font-semibold uppercase tracking-[0.14em] text-muted">
                Budget per person
              </legend>
              <div className="mt-4 flex flex-wrap gap-2">
                {BUDGETS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    aria-pressed={form.budgetBand === b.id}
                    onClick={() => update("budgetBand", b.id)}
                    className={cx(
                      "h-11 rounded-pill border px-4 text-label font-medium transition-colors duration-[--duration-fast]",
                      form.budgetBand === b.id
                        ? "border-primary bg-primary text-primary-contrast"
                        : "border-border text-muted hover:border-border-strong hover:text-text",
                    )}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <Field label="Anything we should know?" id="enq-message">
              <textarea
                id="enq-message"
                rows={5}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="Dietary needs, mobility, an anniversary, a must-do — anything that shapes the trip."
                className={cx(inputClass, "h-auto py-3 leading-relaxed")}
              />
            </Field>
          </>
        )}

        {step === 3 && (
          <dl className="divide-y divide-[--color-border] rounded-lg border border-border">
            <Row label="Name" value={form.name} />
            <Row label="Email" value={form.email} />
            <Row label="Phone" value={form.phone} />
            <Row
              label="Dates"
              value={form.startDate ? `${form.startDate}${form.endDate ? ` → ${form.endDate}` : ""}` : "Flexible"}
            />
            <Row
              label="Travellers"
              value={`${form.adults} adult${form.adults === 1 ? "" : "s"}${form.children ? `, ${form.children} child${form.children === 1 ? "" : "ren"}` : ""}${form.infants ? `, ${form.infants} infant${form.infants === 1 ? "" : "s"}` : ""}`}
            />
            <Row
              label="Destination"
              value={destinations.find((d) => d.slug === form.destinationSlug)?.name ?? "Not decided"}
            />
            <Row label="Budget" value={BUDGETS.find((b) => b.id === form.budgetBand)?.label ?? "Not set"} />
            {form.message && <Row label="Notes" value={form.message} />}
          </dl>
        )}
      </div>

      {result && !result.ok && (
        <p role="alert" className="mt-6 rounded-md border border-accent/40 bg-accent/10 p-4 text-label">
          {result.message}
        </p>
      )}

      <div className="mt-10 flex items-center justify-between gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="h-12 rounded-pill border border-border px-5 text-label font-semibold transition-colors hover:border-border-strong"
          >
            Back
          </button>
        ) : (
          <span />
        )}

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            disabled={!canAdvance}
            onClick={() => {
              track("enquiry_step_completed", { step });
              setStep((s) => s + 1);
            }}
            className="inline-flex h-12 items-center gap-2 rounded-pill bg-primary px-6 text-label font-semibold text-primary-contrast transition-[filter,opacity] hover:brightness-110 disabled:opacity-40"
          >
            Continue
          </button>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            data-cta
            className="inline-flex h-12 items-center gap-2 rounded-pill bg-primary px-6 text-label font-semibold text-primary-contrast transition-[filter,opacity] hover:brightness-110 disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send enquiry"}
          </button>
        )}
      </div>

      <p className="mt-6 text-caption text-muted">
        We use these details only to plan and quote your trip. No payment is taken at this stage.
      </p>
    </form>
  );
}

const inputClass =
  "h-12 w-full rounded-md border border-border bg-surface px-4 text-label text-text outline-none transition-colors duration-[--duration-fast] focus-visible:border-primary";

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-caption font-semibold uppercase tracking-[0.14em] text-muted">
        {label}
      </label>
      <div className="mt-3">{children}</div>
      {error && (
        <p role="alert" className="mt-2 text-label text-accent">
          {error}
        </p>
      )}
    </div>
  );
}

function Counter({
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
          className="grid size-9 place-items-center rounded-full border border-border disabled:opacity-30"
        >
          −
        </button>
        <output className="text-label font-semibold tabular-nums">{value}</output>
        <button
          type="button"
          aria-label={`More ${label.toLowerCase()}`}
          onClick={() => onChange(Math.min(20, value + 1))}
          className="grid size-9 place-items-center rounded-full border border-border"
        >
          +
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3 p-4">
      <dt className="text-label text-muted">{label}</dt>
      <dd className="text-label font-medium">{value}</dd>
    </div>
  );
}
