import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for AgentSkills — How we handle your data.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
        <p className="text-muted-foreground">Last updated: March 2026</p>
        <h2>What Data We Collect</h2>
        <p>
          AgentSkills is a discovery platform. We do not require accounts or
          collect personal information. We may use analytics to understand usage
          patterns.
        </p>
        <h2>Data Sources</h2>
        <p>
          All skill information is sourced from public APIs (GitHub, npm, PyPI).
          We do not scrape private data.
        </p>
        <h2>Cookies</h2>
        <p>We use minimal cookies for theme preference only.</p>
        <h2>Contact</h2>
        <p>Questions? Open an issue on our GitHub repository.</p>
      </div>
    </div>
  );
}
