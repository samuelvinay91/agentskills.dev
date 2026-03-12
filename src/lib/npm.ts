import type { NpmPackageInfo } from "@/types";

const NPM_REGISTRY = "https://registry.npmjs.org";
const NPM_API = "https://api.npmjs.org";

export async function searchNpmPackages(
  query: string,
  size: number = 20
): Promise<NpmPackageInfo[]> {
  try {
    const url = `${NPM_REGISTRY}/-/v1/search?text=${encodeURIComponent(query)}&size=${size}`;
    const response = await fetch(url);
    if (!response.ok) return [];

    const data = (await response.json()) as {
      objects: Array<{
        package: {
          name: string;
          description?: string;
          version: string;
          keywords?: string[];
          links?: { homepage?: string; repository?: string };
          date?: string;
        };
      }>;
    };

    return data.objects.map((obj) => ({
      name: obj.package.name,
      description: obj.package.description || "",
      version: obj.package.version,
      keywords: obj.package.keywords || [],
      homepage: obj.package.links?.homepage,
      repository: obj.package.links?.repository
        ? { url: obj.package.links.repository }
        : undefined,
      lastPublish: obj.package.date,
    }));
  } catch {
    return [];
  }
}

export async function getNpmDownloads(
  packageName: string
): Promise<number | null> {
  try {
    const url = `${NPM_API}/downloads/point/last-week/${encodeURIComponent(packageName)}`;
    const response = await fetch(url);
    if (!response.ok) return null;

    const data = (await response.json()) as { downloads: number };
    return data.downloads;
  } catch {
    return null;
  }
}

export async function getNpmPackageInfo(
  packageName: string
): Promise<NpmPackageInfo | null> {
  try {
    const url = `${NPM_REGISTRY}/${encodeURIComponent(packageName)}`;
    const response = await fetch(url);
    if (!response.ok) return null;

    const data = (await response.json()) as {
      name: string;
      description?: string;
      "dist-tags"?: { latest?: string };
      keywords?: string[];
      homepage?: string;
      repository?: { url?: string };
      license?: string;
      time?: Record<string, string>;
    };

    const latestVersion = data["dist-tags"]?.latest || "";
    const downloads = await getNpmDownloads(packageName);

    return {
      name: data.name,
      description: data.description || "",
      version: latestVersion,
      keywords: data.keywords || [],
      homepage: data.homepage,
      repository: data.repository?.url
        ? { url: data.repository.url }
        : undefined,
      license: data.license,
      downloads: downloads ?? undefined,
      lastPublish: data.time?.[latestVersion],
    };
  } catch {
    return null;
  }
}
