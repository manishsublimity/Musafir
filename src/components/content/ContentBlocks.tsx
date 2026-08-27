import type { AnswerBlock, Faq, VisaInfo } from "@/lib/types";
import { ENTRY_TYPE_LABELS, formatDate, verificationAge } from "@/lib/format";
import { cx } from "@/lib/utils";

/**
 * GEO / AIO CONTENT BLOCKS
 *
 * These render the short, self-contained answers that AI assistants and answer
 * engines quote. They are plain semantic HTML — headings, paragraphs, lists,
 * details — because anything that hides text behind JavaScript or a canvas
 * cannot be quoted accurately, and anything visual-only cannot be quoted at
 * all. Motion is deliberately absent here.
 */

export function AnswerBlocks({ answers }: { answers: AnswerBlock[] }) {
  if (!answers.length) return null;

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {answers.map((answer) => (
        <section
          key={answer.question}
          className="rounded-lg border border-border bg-surface p-6"
        >
          <h3 className="text-h3 leading-tight">{answer.question}</h3>
          {/* The first paragraph is the quotable answer: complete on its own,
              no pronouns pointing at earlier text, no marketing preamble. */}
          <p className="mt-4 text-body">{answer.answer}</p>
          {answer.detail && <p className="mt-3 text-label text-muted">{answer.detail}</p>}
        </section>
      ))}
    </div>
  );
}

/**
 * FAQs as native <details>. They work with no JavaScript, they are keyboard
 * accessible for free, and browser find-in-page can reach closed answers.
 */
export function FaqList({ faqs, className }: { faqs: Faq[]; className?: string }) {
  if (!faqs.length) return null;

  return (
    <div className={cx("divide-y divide-[--color-border] border-y border-border", className)}>
      {faqs.map((faq) => (
        <details key={faq.question} className="group/faq py-5">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-h3 leading-snug marker:hidden">
            <span>{faq.question}</span>
            <span
              aria-hidden="true"
              className="mt-1 grid size-8 shrink-0 place-items-center rounded-full border border-border transition-transform duration-[--duration-base] ease-[--ease-expo] group-open/faq:rotate-45"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
          </summary>
          <p className="mt-4 max-w-3xl text-body text-muted">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}

/**
 * VISA PANEL
 *
 * Never presents a rule as timeless. Every panel carries the entry type, the
 * official source it came from, the date it was last verified, and — when that
 * date is more than 90 days old — a visible warning that it needs re-checking.
 *
 * Making staleness visible is the whole design: a quietly outdated visa rule is
 * far more damaging than an obviously outdated one.
 */
export function VisaPanel({
  visa,
  destinationName,
}: {
  visa: VisaInfo;
  destinationName: string;
}) {
  const { days, stale } = verificationAge(visa.lastVerified);

  return (
    <section className="rounded-lg border border-border bg-surface p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-h3">Visa for {destinationName}</h3>
          <p className="mt-2 text-label text-muted">Indian passport holders</p>
        </div>
        <span className="rounded-pill border border-primary/40 bg-primary/10 px-3.5 py-2 text-caption font-semibold uppercase tracking-[0.08em] text-primary">
          {ENTRY_TYPE_LABELS[visa.entryType]}
        </span>
      </div>

      <dl className="mt-7 grid gap-x-8 gap-y-4 border-t border-border pt-6 sm:grid-cols-2">
        {visa.stayDays && <Row label="Permitted stay" value={`${visa.stayDays} days`} />}
        {visa.processingTime && <Row label="Processing time" value={visa.processingTime} />}
        {visa.fee && (
          <Row label="Fee" value={visa.fee === "varies" ? "Varies — see official source" : String(visa.fee.amount)} />
        )}
      </dl>

      {visa.documents && visa.documents.length > 0 && (
        <div className="mt-6">
          <h4 className="text-caption font-semibold uppercase tracking-[0.14em] text-muted">
            Documents usually required
          </h4>
          <ul className="mt-4 space-y-2">
            {visa.documents.map((doc) => (
              <li key={doc} className="flex gap-3 text-label">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                {doc}
              </li>
            ))}
          </ul>
        </div>
      )}

      {visa.notes && <p className="mt-6 text-body text-muted">{visa.notes}</p>}

      <footer className="mt-7 border-t border-border pt-5">
        {stale && (
          <p className="mb-4 rounded-md border border-accent/40 bg-accent/10 p-3 text-label">
            <strong className="font-semibold">Needs re-verifying.</strong> This rule was last checked{" "}
            {days} days ago. Confirm it against the official source before booking.
          </p>
        )}
        <p className="text-caption text-muted">
          Last verified {formatDate(visa.lastVerified)} against{" "}
          <a
            href={visa.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary underline underline-offset-4"
          >
            {visa.sourceName}
          </a>
          . Entry rules are set by the destination government and can change without notice —
          Musafir Travels assists with applications but cannot guarantee a visa outcome.
        </p>
      </footer>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-caption uppercase tracking-[0.12em] text-muted">{label}</dt>
      <dd className="mt-1.5 text-label font-medium">{value}</dd>
    </div>
  );
}

/** Simple prose block used by guides and editorial pages. */
export function Prose({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cx(
        "space-y-6 text-body [&_h2]:mt-12 [&_h2]:text-h2 [&_h3]:mt-8 [&_h3]:text-h3 [&_p]:text-muted",
        className,
      )}
    >
      {children}
    </div>
  );
}
