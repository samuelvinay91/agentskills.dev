import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for AgentSkills.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
        <p className="text-muted-foreground">Last updated: March 2026</p>
        <h2>Service Description</h2>
        <p>
          AgentSkills is a free discovery platform for AI agent skills and tools.
          We aggregate publicly available data from GitHub, npm, and PyPI.
        </p>
        <h2>No Warranty</h2>
        <p>
          Skills listed on AgentSkills are third-party projects. We do not
          guarantee their quality, security, or maintenance status.
        </p>
        <h2>Attribution</h2>
        <p>
          All skills link back to their original source. We respect open source
          licenses and intellectual property.
        </p>
        <h2>Removal Requests</h2>
        <p>
          If you want your project removed from AgentSkills, open an issue on
          our GitHub repository.
        </p>
      </div>
    </div>
  );
}
