import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { AISummary, AgentSkill } from "@/types";
import { getCached, setCache } from "./cache";
import { CACHE_TTLS } from "./constants";

function getAI(): Ai | null {
  try {
    const ctx = getCloudflareContext();
    return (ctx.env as unknown as CloudflareEnv).AI;
  } catch {
    return null;
  }
}

export async function analyzeSkill(
  skill: AgentSkill,
  readme?: string | null
): Promise<AISummary | null> {
  const cacheKey = `ai:summary:${skill.id}`;
  const cached = await getCached<AISummary>(cacheKey);
  if (cached?.data) return cached.data;

  const ai = getAI();
  if (!ai) return null;

  const readmeSnippet = readme ? readme.slice(0, 3000) : "";

  try {
    const response = (await ai.run(
      "@cf/meta/llama-3.1-8b-instruct-fast" as Parameters<Ai["run"]>[0],
      {
        messages: [
          {
            role: "system",
            content:
              "You analyze AI agent tools and skills. Respond ONLY with valid JSON, no markdown.",
          },
          {
            role: "user",
            content: `Analyze this AI agent skill/tool:

Name: ${skill.displayName}
Description: ${skill.description}
Category: ${skill.category}
Language: ${skill.languages.join(", ") || "Unknown"}
Stars: ${skill.stars || 0}
Tags: ${skill.tags.join(", ")}

README excerpt:
${readmeSnippet}

Provide a JSON response with:
1. "summary": 1-2 sentence plain English summary of what this tool does and why it's useful
2. "setupDifficulty": "easy", "moderate", or "complex"
3. "useCases": array of 2-4 specific use cases
4. "setupSteps": array of 2-4 brief setup steps
5. "platforms": which AI platforms support this (array of: "claude-code", "claude-desktop", "vscode-copilot", "cursor", "windsurf", "continue", "universal")
6. "skillLevel": "beginner", "intermediate", or "advanced"

Respond ONLY with JSON: {"summary": "...", "setupDifficulty": "...", "useCases": [...], "setupSteps": [...], "platforms": [...], "skillLevel": "..."}`,
          },
        ],
      } as Record<string, unknown>
    )) as { response?: string };

    const text = response?.response || "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]) as AISummary;

    if (!parsed.summary || !parsed.setupDifficulty) return null;

    await setCache(cacheKey, parsed, CACHE_TTLS.AI_SUMMARY);

    return parsed;
  } catch (error) {
    console.error("AI analysis failed:", error);
    return null;
  }
}

export async function rankTrendingSkills(
  skills: AgentSkill[]
): Promise<{ id: string; reason: string; score: number }[]> {
  const ai = getAI();
  if (!ai) {
    return skills.map((s) => ({
      id: s.id,
      reason: `${s.stars} stars on GitHub`,
      score: Math.min(100, (s.stars || 0) / 10),
    }));
  }

  const skillList = skills
    .slice(0, 20)
    .map(
      (s, i) =>
        `${i + 1}. ${s.displayName} - ${s.description} (${s.stars} stars, ${s.category})`
    )
    .join("\n");

  try {
    const response = (await ai.run(
      "@cf/meta/llama-3.1-8b-instruct-fast" as Parameters<Ai["run"]>[0],
      {
        messages: [
          {
            role: "system",
            content:
              "You rank AI agent tools by usefulness to developers. Respond ONLY with valid JSON.",
          },
          {
            role: "user",
            content: `Rank these AI agent skills by how useful and interesting they are for developers building AI-powered applications.

${skillList}

Respond with a JSON array: [{"index": 1, "reason": "one sentence why", "score": 85}, ...]
Score from 0-100. Only include top 12.`,
          },
        ],
      } as Record<string, unknown>
    )) as { response?: string };

    const text = response?.response || "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const rankings = JSON.parse(jsonMatch[0]) as {
      index: number;
      reason: string;
      score: number;
    }[];

    return rankings
      .filter((r) => r.index >= 1 && r.index <= skills.length)
      .map((r) => ({
        id: skills[r.index - 1].id,
        reason: r.reason,
        score: r.score,
      }));
  } catch {
    return skills.map((s) => ({
      id: s.id,
      reason: `${s.stars} stars`,
      score: Math.min(100, (s.stars || 0) / 10),
    }));
  }
}
