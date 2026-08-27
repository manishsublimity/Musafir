import type { Currency, Money, Season } from "./types";

const LOCALE = "en-IN";

/**
 * Formats money for display. Always goes through here — Indian digit grouping
 * (₹1,84,500 not ₹184,500) is wrong by default in most `toLocaleString` calls
 * that don't pass the locale, and a travel site gets that wrong very visibly.
 */
export function formatMoney(money: Money, opts?: { compact?: boolean }): string {
  if (opts?.compact && money.currency === "INR") return formatCompactINR(money.amount);
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: money.currency,
    maximumFractionDigits: 0,
  }).format(money.amount);
}

/** ₹1,84,500 → "₹1.85L". Used only where space genuinely forces it. */
export function formatCompactINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2).replace(/\.00$/, "")}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2).replace(/\.00$/, "")}L`;
  if (amount >= 1000) return `₹${Math.round(amount / 1000)}K`;
  return `₹${amount}`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat(LOCALE).format(value);
}

export function currencySymbol(currency: Currency): string {
  return { INR: "₹", USD: "$", AED: "AED ", EUR: "€" }[currency];
}

const MONTH_LABELS: Record<Season, string> = {
  jan: "Jan", feb: "Feb", mar: "Mar", apr: "Apr", may: "May", jun: "Jun",
  jul: "Jul", aug: "Aug", sep: "Sep", oct: "Oct", nov: "Nov", dec: "Dec",
};

export const MONTH_ORDER: Season[] = [
  "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec",
];

export function monthLabel(month: Season): string {
  return MONTH_LABELS[month];
}

/**
 * Turns a set of months into readable ranges — ["mar","apr","may","sep","oct"]
 * becomes "Mar–May, Sep–Oct" rather than a comma-separated list of twelve.
 */
export function formatSeasonRanges(months: Season[]): string {
  if (!months.length) return "Year-round";
  const indices = months
    .map((m) => MONTH_ORDER.indexOf(m))
    .sort((a, b) => a - b);

  const runs: [number, number][] = [];
  let start = indices[0];
  let prev = indices[0];
  for (const i of indices.slice(1)) {
    if (i === prev + 1) {
      prev = i;
    } else {
      runs.push([start, prev]);
      start = i;
      prev = i;
    }
  }
  runs.push([start, prev]);

  // A run ending in December that pairs with one starting in January wraps.
  if (runs.length > 1) {
    const first = runs[0];
    const last = runs[runs.length - 1];
    if (first[0] === 0 && last[1] === 11) {
      runs.pop();
      runs.shift();
      runs.unshift([last[0], first[1]]);
    }
  }

  return runs
    .map(([a, b]) =>
      a === b
        ? monthLabel(MONTH_ORDER[a])
        : `${monthLabel(MONTH_ORDER[a])}–${monthLabel(MONTH_ORDER[b])}`,
    )
    .join(", ");
}

export function formatDuration(days: number, nights: number): string {
  return `${days} Days / ${nights} Nights`;
}

export function formatMinutes(mins?: number): string | undefined {
  if (!mins) return undefined;
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

/**
 * Visa records go stale silently, which is the dangerous failure mode. This
 * drives the "re-verify" flag the visa UI shows next to any old record.
 */
export function verificationAge(iso: string): { days: number; stale: boolean } {
  const days = Math.floor((Date.now() - Date.parse(iso)) / 86_400_000);
  return { days, stale: days > 90 };
}

export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export const STYLE_LABELS: Record<string, string> = {
  couple: "Couple",
  family: "Family",
  friends: "Friends",
  solo: "Solo",
  luxury: "Luxury",
  adventure: "Adventure",
  honeymoon: "Honeymoon",
  "senior-friendly": "Senior-friendly",
  weekend: "Weekend",
  wildlife: "Wildlife",
  beach: "Beach",
  winter: "Winter",
  cultural: "Cultural",
};

export const REGION_LABELS: Record<string, string> = {
  asia: "Asia",
  europe: "Europe",
  "middle-east": "Middle East",
  africa: "Africa",
  oceania: "Australia & New Zealand",
  americas: "Americas",
  scandinavia: "Scandinavia",
  india: "India",
};

export const ENTRY_TYPE_LABELS: Record<string, string> = {
  "visa-free": "Visa-free",
  "visa-on-arrival": "Visa on arrival",
  "e-visa": "e-Visa",
  eta: "Electronic travel authority",
  "sticker-visa": "Embassy visa",
  "pre-approved": "Pre-approved visa",
};

export const DURATION_LABELS: Record<string, string> = {
  "2-3": "2–3 Days",
  "4-5": "4–5 Days",
  "6-7": "6–7 Days",
  "8-10": "8–10 Days",
  "11-14": "11–14 Days",
  "15+": "15+ Days",
};

export const TRANSPORT_LABELS: Record<string, string> = {
  flight: "Flight",
  transfer: "Transfer",
  train: "Train",
  cruise: "Boat",
  ferry: "Ferry",
  coach: "Coach",
  walk: "On foot",
};
