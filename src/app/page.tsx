import type { Metadata } from "next";
import { SearchBar } from "@/components/search-bar";
import { CategoryChips } from "@/components/category-chips";
import { Bot, Sparkles, Zap, Shield } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SITE_URL } from "@/lib/constants";
import { SkillCard } from "@/components/skill-card";
import { getTrendingSkills } from "@/lib/github";
import { getCached, setCache } from "@/lib/cache";
import { CACHE_TTLS } from "@/lib/constants";

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

function TrendingSkillsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border p-6 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 space-y-12">
      {/* Hero */}
      <section className="text-center space-y-6">
        <div className="flex items-center justify-center gap-2">
          <Bot className="h-10 w-10 text-primary" />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Agent<span className="text-primary">Skills</span>
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover AI agent skills, MCP servers, and tools for Claude, Copilot,
          Cursor, and more.
        </p>
        <Suspense>
          <SearchBar />
        </Suspense>
      </section>

      {/* Categories */}
      <section className="space-y-4">
        <h2 className="text-center text-lg font-semibold text-muted-foreground">
          Browse by Category
        </h2>
        <Suspense>
          <CategoryChips />
        </Suspense>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="text-center space-y-2 p-6">
          <Sparkles className="h-8 w-8 mx-auto text-primary" />
          <h3 className="font-semibold">AI-Powered Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Every skill is analyzed by AI for setup difficulty, use cases, and
            platform compatibility.
          </p>
        </div>
        <div className="text-center space-y-2 p-6">
          <Zap className="h-8 w-8 mx-auto text-primary" />
          <h3 className="font-semibold">Multi-Platform</h3>
          <p className="text-sm text-muted-foreground">
            Find tools that work with Claude Code, VS Code Copilot, Cursor,
            Windsurf, and more.
          </p>
        </div>
        <div className="text-center space-y-2 p-6">
          <Shield className="h-8 w-8 mx-auto text-primary" />
          <h3 className="font-semibold">Trusted Sources</h3>
          <p className="text-sm text-muted-foreground">
            All skills sourced from GitHub and npm with real stats — stars,
            downloads, and activity.
          </p>
        </div>
      </section>

      {/* Trending */}
      <section className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Trending Skills</h2>
          <p className="text-muted-foreground mt-1">
            AI-picked skills gaining traction this week
          </p>
        </div>
        <Suspense fallback={<TrendingSkillsSkeleton />}>
          <TrendingSkillsSection />
        </Suspense>
      </section>
    </div>
  );
}

async function TrendingSkillsSection() {
  let skills: Awaited<ReturnType<typeof getTrendingSkills>> | undefined;

  try {
    const cached = await getCached<Awaited<ReturnType<typeof getTrendingSkills>>>(
      "trending:skills:v1"
    );
    if (cached?.fresh) {
      skills = cached.data;
    } else {
      skills = await getTrendingSkills();
      if (skills.length > 0) {
        await setCache("trending:skills:v1", skills, CACHE_TTLS.TRENDING);
      }
      if (skills.length === 0 && cached?.data) {
        skills = cached.data;
      }
    }
  } catch {
    skills = [];
  }

  if (!skills || skills.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No trending skills available right now. Try searching above!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {skills.slice(0, 12).map((skill) => (
        <SkillCard key={skill.id} skill={skill} />
      ))}
    </div>
  );
}
