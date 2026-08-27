import type { HotelCategory, Money, PricingModel } from "./types";

/**
 * PRICING ENGINE
 *
 * The customiser must never display a number the business cannot honour, so
 * every figure on screen is derived here from the package's own `PricingModel`
 * rather than being assembled ad hoc in the component. One function, one set of
 * rules, one place to audit.
 */

export interface QuoteInput {
  adults: number;
  children: number;
  infants: number;
  hotelCategory: HotelCategory;
  /** Ids of selected add-ons from the package's own `addOns` list. */
  addOnIds: string[];
}

export interface QuoteLine {
  id: string;
  label: string;
  detail?: string;
  amount: number;
}

export interface Quote {
  travellers: number;
  perAdult: number;
  base: QuoteLine[];
  addOns: QuoteLine[];
  subtotal: number;
  tax: number;
  taxLabel: string;
  total: number;
  perPerson: number;
  currency: Money["currency"];
  disclaimer: string;
}

export function buildQuote(model: PricingModel, input: QuoteInput): Quote {
  const currency = model.basePerAdult.currency;
  const multiplier =
    model.hotelCategoryMultiplier[input.hotelCategory] ??
    model.hotelCategoryMultiplier[model.baseHotelCategory] ??
    1;

  const perAdult = Math.round(model.basePerAdult.amount * multiplier);
  const perChild = Math.round(perAdult * model.childPercent);
  const perInfant = Math.round(perAdult * model.infantPercent);

  const base: QuoteLine[] = [];
  if (input.adults > 0) {
    base.push({
      id: "adults",
      label: `Adults × ${input.adults}`,
      detail: `${formatPlain(perAdult, currency)} each · ${input.hotelCategory} · twin sharing`,
      amount: perAdult * input.adults,
    });
  }
  if (input.children > 0) {
    base.push({
      id: "children",
      label: `Children × ${input.children}`,
      detail: `${formatPlain(perChild, currency)} each · sharing with adults`,
      amount: perChild * input.children,
    });
  }
  if (input.infants > 0) {
    base.push({
      id: "infants",
      label: `Infants × ${input.infants}`,
      detail: `${formatPlain(perInfant, currency)} each`,
      amount: perInfant * input.infants,
    });
  }

  const payingTravellers = input.adults + input.children;
  const addOns: QuoteLine[] = [];
  for (const id of input.addOnIds) {
    const addOn = model.addOns.find((a) => a.id === id);
    if (!addOn) continue;
    const qty = addOn.perBooking ? 1 : payingTravellers;
    const amount = addOn.price.amount * qty;
    if (amount === 0) continue; // free options are choices, not line items
    addOns.push({
      id: addOn.id,
      label: addOn.label,
      detail: addOn.perBooking
        ? "per booking"
        : `${formatPlain(addOn.price.amount, currency)} × ${qty} travellers`,
      amount,
    });
  }

  const subtotal =
    base.reduce((sum, l) => sum + l.amount, 0) + addOns.reduce((sum, l) => sum + l.amount, 0);
  const tax = Math.round(subtotal * model.taxRate);
  const total = subtotal + tax;
  const headcount = input.adults + input.children + input.infants;

  return {
    travellers: headcount,
    perAdult,
    base,
    addOns,
    subtotal,
    tax,
    taxLabel: model.taxLabel,
    total,
    perPerson: headcount ? Math.round(total / headcount) : 0,
    currency,
    disclaimer: model.priceDisclaimer,
  };
}

function formatPlain(amount: number, currency: Money["currency"]): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Hotel categories a given package actually prices, in display order. */
export function availableCategories(model: PricingModel): HotelCategory[] {
  const order: HotelCategory[] = ["3-star", "4-star", "5-star", "boutique", "resort", "villa"];
  return order.filter((c) => model.hotelCategoryMultiplier[c] !== undefined);
}
