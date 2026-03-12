import type { MetadataRoute } from "next";
import { SITE_URL, SKILL_CATEGORIES } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/search`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = Object.keys(SKILL_CATEGORIES).map(
    (cat) => ({
      url: `${SITE_URL}/search?cat=${cat}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })
  );

  return [...staticPages, ...categoryPages];
}
