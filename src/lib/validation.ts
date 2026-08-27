import { z } from "zod";

/**
 * Every public endpoint parses its body through one of these schemas before
 * touching it. Nothing downstream sees an unvalidated field.
 */

/** Strips control characters and trims. Applied to every free-text field. */
const CONTROL_CHARS = new RegExp("[\u0000-\u001F\u007F]", "g");

const clean = (max: number) =>
  z
    .string()
    .transform((value) => value.replace(CONTROL_CHARS, "").trim())
    .pipe(z.string().max(max));

/**
 * Two silent bot checks that never inconvenience a real person: an invisible
 * field that must stay empty, and a minimum time between the form rendering and
 * being submitted.
 */
const MIN_FILL_MS = 2500;

const antiSpam = {
  company: z.string().max(120).optional().default(""),
  renderedAt: z.number().int().nonnegative(),
};

export function passesSpamChecks(input: { company?: string; renderedAt: number }): boolean {
  if (input.company && input.company.length > 0) return false;
  if (!input.renderedAt) return false;
  const elapsed = Date.now() - input.renderedAt;
  // Also reject clocks far in the future, which indicates a replayed payload.
  return elapsed >= MIN_FILL_MS && elapsed < 1000 * 60 * 60 * 12;
}

export const newsletterSchema = z.object({
  email: z.string().email().max(160),
  ...antiSpam,
});

/** Indian mobile numbers, with or without +91, plus general international. */
const phoneSchema = z
  .string()
  .transform((value) => value.replace(/[\s()-]/g, ""))
  .pipe(z.string().regex(/^(\+?\d{1,3})?\d{7,12}$/, "Enter a valid phone number"));

export const enquirySchema = z.object({
  name: clean(120).pipe(z.string().min(2, "Please tell us your name")),
  email: z.string().email("Enter a valid email address").max(160),
  phone: phoneSchema,
  destinationSlug: clean(80).optional(),
  packageSlug: clean(120).optional(),
  startDate: z.string().max(20).optional(),
  endDate: z.string().max(20).optional(),
  travellers: z.object({
    adults: z.number().int().min(1).max(30),
    children: z.number().int().min(0).max(20),
    infants: z.number().int().min(0).max(10),
  }),
  style: clean(40).optional(),
  budgetBand: z.enum(["under-50k", "50k-1l", "1l-2l", "2l-plus"]).optional(),
  durationBand: z.enum(["3-5", "6-8", "9-12", "12-plus"]).optional(),
  interests: z.array(clean(40)).max(12).optional(),
  message: clean(2000).optional(),
  ...antiSpam,
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
