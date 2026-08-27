import type { Metadata } from "next";
import { PolicyPage } from "@/components/content/PolicyPage";
import { cancellationPolicy } from "@/content/legal";
import { metadataFrom } from "@/lib/seo";

export const metadata: Metadata = metadataFrom({
  title: "Cancellation & Refund Policy | Musafir Travels",
  description:
    "Musafir Travels cancellation charges by notice period, non-refundable components, refund timing and what happens if a visa is refused.",
  canonical: "/cancellation-policy",
});

export default function Page() {
  return <PolicyPage doc={cancellationPolicy} href="/cancellation-policy" />;
}
