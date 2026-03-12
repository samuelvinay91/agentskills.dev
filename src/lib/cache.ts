import { getCloudflareContext } from "@opennextjs/cloudflare";

interface CacheEntry<T> {
  data: T;
  cachedAt: number;
  expiresAt: number;
  etag?: string;
}

function getKV(): KVNamespace | null {
  try {
    const ctx = getCloudflareContext();
    return (ctx.env as unknown as CloudflareEnv).AGENTSKILLS_CACHE;
  } catch {
    return null;
  }
}

export async function getCached<T>(
  key: string
): Promise<{ data: T; fresh: boolean; etag?: string } | null> {
  const kv = getKV();
  if (!kv) return null;

  try {
    const entry = await kv.get<CacheEntry<T>>(key, "json");
    if (!entry) return null;

    const now = Date.now();
    return {
      data: entry.data,
      fresh: now < entry.expiresAt,
      etag: entry.etag,
    };
  } catch {
    return null;
  }
}

export async function setCache<T>(
  key: string,
  data: T,
  ttlSeconds: number,
  etag?: string
): Promise<void> {
  const kv = getKV();
  if (!kv) return;

  const now = Date.now();
  const entry: CacheEntry<T> = {
    data,
    cachedAt: now,
    expiresAt: now + ttlSeconds * 1000,
    etag,
  };

  try {
    // Physical TTL = 3x logical TTL for SWR
    await kv.put(key, JSON.stringify(entry), {
      expirationTtl: ttlSeconds * 3,
    });
  } catch {
    // Cache write failures are non-fatal
  }
}
