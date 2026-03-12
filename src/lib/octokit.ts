import { Octokit } from "@octokit/core";
import { throttling } from "@octokit/plugin-throttling";

const ThrottledOctokit = Octokit.plugin(throttling);

const octokitCache = new Map<string, InstanceType<typeof ThrottledOctokit>>();

export function createOctokit(
  token?: string
): InstanceType<typeof ThrottledOctokit> {
  const auth = token || process.env.GITHUB_TOKEN || "";
  const cacheKey = auth || "__anonymous__";

  const cached = octokitCache.get(cacheKey);
  if (cached) return cached;

  const instance = new ThrottledOctokit({
    auth: auth || undefined,
    throttle: {
      onRateLimit: (
        retryAfter: number,
        options: Record<string, unknown>,
        _octokit: unknown,
        retryCount: number
      ) => {
        console.warn(
          `Rate limit hit for ${options.url}, retry after ${retryAfter}s`
        );
        return retryCount < 2;
      },
      onSecondaryRateLimit: (
        retryAfter: number,
        options: Record<string, unknown>,
        _octokit: unknown,
        retryCount: number
      ) => {
        console.warn(
          `Secondary rate limit for ${options.url}, retry after ${retryAfter}s`
        );
        return retryCount < 1;
      },
    },
  });

  octokitCache.set(cacheKey, instance);
  return instance;
}
