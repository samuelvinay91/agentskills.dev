interface CloudflareEnv {
  AGENTSKILLS_CACHE: KVNamespace;
  AI: Ai;
  ASSETS: Fetcher;
  GITHUB_TOKEN?: string;
  NPM_REGISTRY_URL?: string;
  CRON_SECRET?: string;
}
