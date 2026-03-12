import { NextRequest, NextResponse } from "next/server";
import { searchSkills, searchSkillsByCategory } from "@/lib/github";
import { getCached, setCache } from "@/lib/cache";
import { CACHE_TTLS } from "@/lib/constants";
import type { AgentSkill } from "@/types";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q") || "";
  const cat = searchParams.get("cat") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const cacheKey = `api:search:${q}:${cat}:${page}`;

  const cached = await getCached<{ skills: AgentSkill[]; totalCount: number }>(
    cacheKey
  );
  if (cached?.fresh) {
    return NextResponse.json(cached.data);
  }

  try {
    let result;
    if (cat) {
      result = await searchSkillsByCategory(cat, page);
    } else if (q) {
      result = await searchSkills(q, { page });
    } else {
      return NextResponse.json({ skills: [], totalCount: 0 });
    }

    if (result.skills.length > 0) {
      await setCache(cacheKey, result, CACHE_TTLS.SEARCH_SKILLS);
    }

    return NextResponse.json(result);
  } catch (error) {
    if (cached?.data) {
      return NextResponse.json(cached.data);
    }
    console.error("Search error:", error);
    return NextResponse.json({ skills: [], totalCount: 0 }, { status: 500 });
  }
}
