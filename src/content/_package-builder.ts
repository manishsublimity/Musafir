import type {
  DurationBucket,
  HotelCategory,
  Money,
  Package,
  PriceAddOn,
  PricingModel,
} from "@/lib/types";

export const inr = (amount: number): Money => ({ amount, currency: "INR" });

export function durationBucket(days: number): DurationBucket {
  if (days <= 3) return "2-3";
  if (days <= 5) return "4-5";
  if (days <= 7) return "6-7";
  if (days <= 10) return "8-10";
  if (days <= 14) return "11-14";
  return "15+";
}

/**
 * GST on tour packages is a real, published rate — it is set here once rather
 * than being invented per package, so a rate change is a one-line edit.
 * Confirm the applicable rate with the finance team before each pricing cycle.
 */
export const TAX = { rate: 0.05, label: "GST (5%)" };

export const PRICE_DISCLAIMER =
  "Indicative per-person price on twin sharing. Final pricing depends on your travel dates, airline fares and hotel availability at the time of booking, and is confirmed in writing before any payment is taken.";

interface PricingInput {
  basePerAdult: number;
  baseHotelCategory: HotelCategory;
  hotelCategoryMultiplier?: Partial<Record<HotelCategory, number>>;
  addOns?: PriceAddOn[];
}

export function pricing(input: PricingInput): PricingModel {
  return {
    basePerAdult: inr(input.basePerAdult),
    baseHotelCategory: input.baseHotelCategory,
    hotelCategoryMultiplier: input.hotelCategoryMultiplier ?? {
      "3-star": 0.84,
      "4-star": 1,
      "5-star": 1.42,
    },
    childPercent: 0.72,
    infantPercent: 0.12,
    taxRate: TAX.rate,
    taxLabel: TAX.label,
    addOns: input.addOns ?? [],
    priceDisclaimer: PRICE_DISCLAIMER,
  };
}

type PackageInput = Omit<Package, "durationBucket" | "gallery" | "answers"> &
  Partial<Pick<Package, "durationBucket" | "gallery" | "answers">>;

export function pkg(input: PackageInput): Package {
  return {
    durationBucket: durationBucket(input.days),
    gallery: [],
    answers: [],
    ...input,
  };
}
