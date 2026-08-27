import { NextResponse } from "next/server";
import { enquirySchema, passesSpamChecks } from "@/lib/validation";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The single enquiry endpoint. Every "Plan my trip", "Customise this trip" and
 * package enquiry funnels through here.
 *
 * Order matters: throttle, then parse, then spam-check, then act. Nothing
 * downstream ever sees a body that has not been through the schema.
 */
export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "enquiry"), 8, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "We have received several enquiries from this connection already. Please call or WhatsApp us instead.",
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      { ok: false, message: "Please check the highlighted fields.", fieldErrors },
      { status: 400 },
    );
  }

  if (!passesSpamChecks(parsed.data)) {
    // Silent accept. A real person never lands here.
    return NextResponse.json({ ok: true, message: "Thank you — we will be in touch." });
  }

  // TODO(integration): hand `parsed.data` to the CRM / trip-designer inbox.
  // The reference number is generated here so the traveller always leaves with
  // something to quote back to us, even before the CRM is wired up.
  const reference = `MSF-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  return NextResponse.json({
    ok: true,
    reference,
    message:
      "Thank you. A trip designer will come back to you within one working day with a draft itinerary.",
  });
}
