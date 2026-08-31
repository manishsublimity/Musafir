import type { Metadata } from "next";
import { PolicyPage } from "@/components/content/PolicyPage";
import { privacyPolicy } from "@/content/legal";
import { metadataFrom } from "@/lib/seo";

export const metadata: Metadata = metadataFrom({
  title: "Privacy Policy",
  description:
    "What Musafir Travels collects when you enquire or book, why, who it is shared with, how long it is kept and how to have it deleted.",
  canonical: "/privacy-policy",
});

export default function Page() {
  return <PolicyPage doc={privacyPolicy} href="/privacy-policy" />;
}
