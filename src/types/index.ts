// Represents an AI agent skill/tool
export interface AgentSkill {
  id: string; // unique identifier: "github:owner/name" or "npm:package-name"
  source: "github" | "npm" | "pypi";
  name: string;
  displayName: string;
  description: string;
  owner: string;
  url: string;
  homepage?: string;

  // Categorization
  category: SkillCategory;
  platform: Platform[];
  languages: string[];
  tags: string[];
  license?: string;

  // Stats
  stars?: number;
  downloads?: number;
  forks?: number;
  lastUpdated: string;
  createdAt?: string;

  // AI-generated
  aiSummary?: AISummary;
}

export type SkillCategory =
  | "mcp-server"
  | "langchain-tool"
  | "llamaindex-tool"
  | "agent-framework"
  | "copilot-extension"
  | "prompt-template"
  | "agent-workflow"
  | "utility";

export type Platform =
  | "claude-code"
  | "claude-desktop"
  | "vscode-copilot"
  | "cursor"
  | "windsurf"
  | "continue"
  | "universal";

export interface AISummary {
  summary: string;
  setupDifficulty: "easy" | "moderate" | "complex";
  useCases: string[];
  setupSteps: string[];
  platforms: Platform[];
  skillLevel: "beginner" | "intermediate" | "advanced";
}

export interface SearchResult {
  skills: AgentSkill[];
  totalCount: number;
  page: number;
  hasNextPage: boolean;
}

export interface TrendingSkill extends AgentSkill {
  aiReason: string;
  trendScore: number;
}

export interface NpmPackageInfo {
  name: string;
  description: string;
  version: string;
  keywords: string[];
  homepage?: string;
  repository?: { url: string };
  license?: string;
  downloads?: number;
  lastPublish?: string;
}
