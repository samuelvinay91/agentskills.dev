import { createOctokit } from "./octokit";
import type { AgentSkill, SkillCategory, Platform } from "@/types";

function detectCategory(
  topics: string[],
  name: string,
  description: string
): SkillCategory {
  const text = `${name} ${description} ${topics.join(" ")}`.toLowerCase();

  if (
    topics.includes("mcp-server") ||
    topics.includes("model-context-protocol") ||
    text.includes("mcp server") ||
    text.includes("mcp-server")
  )
    return "mcp-server";
  if (
    topics.includes("langchain-tool") ||
    (topics.includes("langchain") && text.includes("tool"))
  )
    return "langchain-tool";
  if (
    topics.includes("llamaindex-tool") ||
    topics.includes("llamaindex")
  )
    return "llamaindex-tool";
  if (
    topics.includes("github-copilot-extension") ||
    topics.includes("vscode-copilot")
  )
    return "copilot-extension";
  if (
    topics.includes("agent-framework") ||
    topics.includes("ai-agent")
  )
    return "agent-framework";
  if (
    text.includes("prompt") ||
    text.includes("system prompt") ||
    text.includes("claude.md")
  )
    return "prompt-template";
  if (
    text.includes("workflow") ||
    text.includes("pipeline") ||
    text.includes("orchestrat")
  )
    return "agent-workflow";

  return "utility";
}

function detectPlatforms(
  topics: string[],
  name: string,
  description: string
): Platform[] {
  const text = `${name} ${description} ${topics.join(" ")}`.toLowerCase();
  const platforms: Platform[] = [];

  if (
    text.includes("claude") ||
    text.includes("mcp") ||
    text.includes("anthropic")
  ) {
    platforms.push("claude-code", "claude-desktop");
  }
  if (
    text.includes("copilot") ||
    text.includes("vscode") ||
    text.includes("vs code")
  ) {
    platforms.push("vscode-copilot");
  }
  if (text.includes("cursor")) platforms.push("cursor");
  if (text.includes("windsurf")) platforms.push("windsurf");
  if (text.includes("continue")) platforms.push("continue");

  // MCP servers work with Claude and compatible clients
  if (platforms.length === 0) {
    const category = detectCategory(topics, name, description);
    if (category === "mcp-server") {
      platforms.push("claude-code", "claude-desktop", "cursor");
    } else {
      platforms.push("universal");
    }
  }

  return [...new Set(platforms)];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function repoToSkill(repo: any): AgentSkill {
  const topics = repo.topics || [];
  const name = repo.name;
  const description = repo.description || "";

  return {
    id: `github:${repo.full_name}`,
    source: "github",
    name: repo.full_name,
    displayName: name
      .replace(/[-_]/g, " ")
      .replace(/\bmcp\b/gi, "MCP")
      .replace(/\bai\b/gi, "AI")
      .replace(/\bsdk\b/gi, "SDK")
      .split(" ")
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    description,
    owner: repo.owner.login,
    url: repo.html_url,
    homepage: repo.homepage || undefined,
    category: detectCategory(topics, name, description),
    platform: detectPlatforms(topics, name, description),
    languages: repo.language ? [repo.language] : [],
    tags: topics,
    license: repo.license?.spdx_id,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    lastUpdated: repo.updated_at,
    createdAt: repo.created_at,
  };
}

export async function searchSkills(
  query: string,
  options: {
    category?: string;
    platform?: string;
    page?: number;
    perPage?: number;
  } = {}
): Promise<{ skills: AgentSkill[]; totalCount: number }> {
  const octokit = createOctokit();
  const { category, page = 1, perPage = 20 } = options;

  let searchQuery = query;
  if (category === "mcp-server") {
    searchQuery = `${query} topic:mcp-server OR "mcp server" in:name,description`;
  } else if (category) {
    searchQuery = `${query} topic:${category}`;
  }

  if (!searchQuery.includes("stars:")) {
    searchQuery += " stars:>3";
  }

  const response = await octokit.request("GET /search/repositories", {
    q: searchQuery,
    sort: "stars",
    order: "desc",
    per_page: perPage,
    page,
  });

  const skills = response.data.items.map(repoToSkill);

  return {
    skills,
    totalCount: response.data.total_count,
  };
}

export async function searchSkillsByCategory(
  category: string,
  page: number = 1
): Promise<{ skills: AgentSkill[]; totalCount: number }> {
  const queries: Record<string, string> = {
    "mcp-server": "topic:mcp-server stars:>3",
    "langchain-tool":
      'topic:langchain-tool OR (topic:langchain "tool" in:description) stars:>10',
    "llamaindex-tool":
      "topic:llamaindex-tool OR topic:llamaindex stars:>10",
    "agent-framework":
      "topic:ai-agent OR topic:agent-framework stars:>50",
    "copilot-extension":
      "topic:github-copilot-extension OR topic:vscode-copilot",
    "prompt-template":
      '"CLAUDE.md" OR "system prompt" OR "prompt template" topic:ai stars:>10',
    "agent-workflow":
      'topic:ai-workflow OR (topic:ai-agent "workflow" in:description) stars:>20',
    utility: "topic:ai-sdk OR topic:llm-tool stars:>20",
  };

  const query = queries[category] || `topic:${category} stars:>5`;
  return searchSkills(query, { page });
}

export async function getSkillDetail(
  owner: string,
  name: string
): Promise<AgentSkill | null> {
  const octokit = createOctokit();

  try {
    const { data: repo } = await octokit.request(
      "GET /repos/{owner}/{repo}",
      { owner, repo: name }
    );

    return repoToSkill(repo);
  } catch {
    return null;
  }
}

export async function getSkillReadme(
  owner: string,
  name: string
): Promise<string | null> {
  const octokit = createOctokit();

  try {
    const { data } = await octokit.request(
      "GET /repos/{owner}/{repo}/readme",
      {
        owner,
        repo: name,
        headers: { accept: "application/vnd.github.raw+json" },
      }
    );

    return typeof data === "string" ? data : null;
  } catch {
    return null;
  }
}

export async function getTrendingSkills(): Promise<AgentSkill[]> {
  const octokit = createOctokit();

  const queries = [
    "topic:mcp-server stars:>10 pushed:>2025-01-01 sort:updated",
    "topic:ai-agent stars:>50 pushed:>2025-01-01 sort:stars",
  ];

  const allSkills: AgentSkill[] = [];

  for (const q of queries) {
    try {
      const response = await octokit.request("GET /search/repositories", {
        q,
        sort: "stars",
        order: "desc",
        per_page: 15,
      });

      allSkills.push(...response.data.items.map(repoToSkill));
    } catch {
      // Continue with other queries
    }
  }

  // Deduplicate by id
  const seen = new Set<string>();
  return allSkills.filter((s) => {
    if (seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });
}
