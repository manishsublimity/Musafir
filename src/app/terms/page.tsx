import type { Metadata } from "next";
import { PolicyPage } from "@/components/content/PolicyPage";
import { termsAndConditions } from "@/content/legal";
import { metadataFrom } from "@/lib/seo";

export const metadata: Metadata = metadataFrom({
  title: "Terms & Conditions",
  description:
    "Booking terms for Musafir Travels — quotations, payment, passports and visas, changes, liability and governing law.",
  canonical: "/terms",
});

export default function Page() {
  return <PolicyPage doc={termsAndConditions} href="/terms" />;
}
