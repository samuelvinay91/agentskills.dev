import { NextResponse } from "next/server";
import { getTrendingSkills } from "@/lib/github";
import { rankTrendingSkills } from "@/lib/ai";
import { getCached, setCache } from "@/lib/cache";
import { CACHE_TTLS } from "@/lib/constants";
import type { AgentSkill } from "@/types";

export const runtime = "edge";

export async function GET() {
  const cacheKey = "trending:skills:ranked:v1";

  const cached = await getCached<AgentSkill[]>(cacheKey);
  if (cached?.fresh) {
    return NextResponse.json({ skills: cached.data });
  }

  try {
    const skills = await getTrendingSkills();
    const rankings = await rankTrendingSkills(skills);

    const rankedSkills = rankings
      .sort((a, b) => b.score - a.score)
      .map((r) => {
        const skill = skills.find((s) => s.id === r.id);
        return skill ? { ...skill, aiReason: r.reason } : null;
      })
      .filter(Boolean) as AgentSkill[];

    if (rankedSkills.length > 0) {
      await setCache(cacheKey, rankedSkills, CACHE_TTLS.TRENDING);
    }

    return NextResponse.json({ skills: rankedSkills });
  } catch (error) {
    if (cached?.data) {
      return NextResponse.json({ skills: cached.data });
    }
    console.error("Trending error:", error);
    return NextResponse.json({ skills: [] }, { status: 500 });
  }
}
