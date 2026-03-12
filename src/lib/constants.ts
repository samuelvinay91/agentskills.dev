export const SITE_NAME = "AgentSkills";
export const SITE_URL = "https://agentskills.dev";
export const SITE_DESCRIPTION =
  "Discover AI agent skills, MCP servers, and tools for Claude, Copilot, Cursor, and more.";

export const SKILL_CATEGORIES: Record<
  string,
  { label: string; description: string; icon: string; color: string }
> = {
  "mcp-server": {
    label: "MCP Servers",
    description:
      "Model Context Protocol servers for Claude and other AI assistants",
    icon: "Server",
    color: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  },
  "langchain-tool": {
    label: "LangChain Tools",
    description: "Custom tools and integrations for LangChain agents",
    icon: "Link",
    color: "bg-green-500/10 text-green-700 dark:text-green-300",
  },
  "llamaindex-tool": {
    label: "LlamaIndex Tools",
    description: "Tools and data connectors for LlamaIndex",
    icon: "Database",
    color: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
  },
  "agent-framework": {
    label: "Agent Frameworks",
    description: "Full agent frameworks and orchestration tools",
    icon: "Cpu",
    color: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  },
  "copilot-extension": {
    label: "Copilot Extensions",
    description: "Extensions for GitHub Copilot and VS Code",
    icon: "Puzzle",
    color: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  },
  "prompt-template": {
    label: "Prompt Templates",
    description:
      "System prompts, CLAUDE.md files, and instruction templates",
    icon: "FileText",
    color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
  },
  "agent-workflow": {
    label: "Agent Workflows",
    description: "Multi-step agent patterns and automation recipes",
    icon: "GitBranch",
    color: "bg-pink-500/10 text-pink-700 dark:text-pink-300",
  },
  utility: {
    label: "Utilities",
    description:
      "Helper tools, SDKs, and developer utilities for AI agents",
    icon: "Wrench",
    color: "bg-gray-500/10 text-gray-700 dark:text-gray-300",
  },
};

export const PLATFORMS: Record<string, { label: string; color: string }> = {
  "claude-code": {
    label: "Claude Code",
    color: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
  },
  "claude-desktop": {
    label: "Claude Desktop",
    color: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  "vscode-copilot": {
    label: "VS Code Copilot",
    color: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  },
  cursor: {
    label: "Cursor",
    color: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  },
  windsurf: {
    label: "Windsurf",
    color: "bg-teal-500/10 text-teal-700 dark:text-teal-300",
  },
  continue: {
    label: "Continue",
    color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  universal: {
    label: "Universal",
    color: "bg-gray-500/10 text-gray-700 dark:text-gray-300",
  },
};

export const GITHUB_SEARCH_QUERIES = {
  mcp: [
    "topic:mcp-server stars:>3",
    "topic:model-context-protocol stars:>3",
  ],
  langchain: [
    "topic:langchain-tool stars:>10",
  ],
  agent: [
    "topic:ai-agent stars:>50",
    "topic:agent-framework stars:>50",
  ],
  copilot: [
    "topic:github-copilot-extension",
  ],
};

export const CACHE_TTLS = {
  SEARCH_SKILLS: 900, // 15 min
  SKILL_DETAIL: 300, // 5 min
  AI_SUMMARY: 86400, // 24 hours
  TRENDING: 1800, // 30 min
  NPM_STATS: 3600, // 1 hour
  CATEGORY_LIST: 900, // 15 min
};
