import { NextResponse } from "next/server";
import { newsletterSchema, passesSpamChecks } from "@/lib/validation";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "newsletter"), 5, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, message: "Too many attempts. Please try again a little later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  // Bots get the same success response a person does — telling them which
  // check they failed just helps them pass it next time.
  if (!passesSpamChecks(parsed.data)) {
    return NextResponse.json({ ok: true, message: "You're on the list. Talk soon." });
  }

  // TODO(integration): forward `parsed.data.email` to the mailing provider.
  // Deliberately not logged here — an email address in server logs is a data
  // retention problem nobody signed up for.

  return NextResponse.json({
    ok: true,
    message: "You're on the list. Expect a few good itineraries, not a newsletter treadmill.",
  });
}
