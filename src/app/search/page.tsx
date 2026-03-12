import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchBar } from "@/components/search-bar";
import { CategoryChips } from "@/components/category-chips";
import { SkillCard } from "@/components/skill-card";
import { Skeleton } from "@/components/ui/skeleton";
import { searchSkills, searchSkillsByCategory } from "@/lib/github";
import { getCached, setCache } from "@/lib/cache";
import { CACHE_TTLS, SITE_URL } from "@/lib/constants";
import type { AgentSkill } from "@/types";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const q = params.q;
  const cat = params.cat;

  const title = q
    ? `"${q}" — AI Agent Skills`
    : cat
      ? `${cat.replace(/-/g, " ")} Skills`
      : "Explore AI Agent Skills";

  return {
    title,
    description: `Browse AI agent skills${q ? ` matching "${q}"` : ""}${cat ? ` in ${cat}` : ""}.`,
    alternates: {
      canonical: cat
        ? `${SITE_URL}/search?cat=${encodeURIComponent(cat)}`
        : q
          ? `${SITE_URL}/search?q=${encodeURIComponent(q)}`
          : `${SITE_URL}/search`,
    },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const cat = params.cat || "";
  const page = parseInt(params.page || "1", 10);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">
          {q
            ? `Results for "${q}"`
            : cat
              ? `${cat.replace(/-/g, " ")} Skills`
              : "Explore Skills"}
        </h1>
        <Suspense>
          <SearchBar defaultValue={q} />
        </Suspense>
        <Suspense>
          <CategoryChips />
        </Suspense>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        }
      >
        <SearchResults q={q} cat={cat} page={page} />
      </Suspense>
    </div>
  );
}

async function SearchResults({
  q,
  cat,
  page,
}: {
  q: string;
  cat: string;
  page: number;
}) {
  let skills: AgentSkill[] = [];
  let totalCount = 0;

  const cacheKey = `search:${q}:${cat}:${page}`;

  try {
    const cached = await getCached<{
      skills: AgentSkill[];
      totalCount: number;
    }>(cacheKey);
    if (cached?.fresh) {
      skills = cached.data.skills;
      totalCount = cached.data.totalCount;
    } else {
      let result;
      if (cat) {
        result = await searchSkillsByCategory(cat, page);
      } else if (q) {
        result = await searchSkills(q, { page });
      } else {
        result = await searchSkillsByCategory("mcp-server", page);
      }

      skills = result.skills;
      totalCount = result.totalCount;

      if (skills.length > 0) {
        await setCache(cacheKey, { skills, totalCount }, CACHE_TTLS.SEARCH_SKILLS);
      }

      if (skills.length === 0 && cached?.data) {
        skills = cached.data.skills;
        totalCount = cached.data.totalCount;
      }
    }
  } catch {
    skills = [];
  }

  if (skills.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No skills found. Try a different search or category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{totalCount} skills found</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>
    </div>
  );
}
