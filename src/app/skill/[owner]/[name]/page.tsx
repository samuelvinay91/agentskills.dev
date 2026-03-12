import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Star, GitFork, ExternalLink, Download, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SetupDifficultyBadge } from "@/components/setup-difficulty-badge";
import { getSkillDetail, getSkillReadme } from "@/lib/github";
import { analyzeSkill } from "@/lib/ai";
import { SKILL_CATEGORIES, PLATFORMS, SITE_URL } from "@/lib/constants";
import { formatNumber, timeAgo } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ owner: string; name: string }>;
}): Promise<Metadata> {
  const { owner, name } = await params;
  const skill = await getSkillDetail(owner, name);

  if (!skill) return { title: "Skill Not Found" };

  return {
    title: `${skill.displayName} — AI Agent Skill`,
    description:
      skill.description ||
      `${skill.displayName} - an AI agent skill on AgentSkills`,
    alternates: { canonical: `${SITE_URL}/skill/${owner}/${name}` },
  };
}

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ owner: string; name: string }>;
}) {
  const { owner, name } = await params;
  const skill = await getSkillDetail(owner, name);

  if (!skill) notFound();

  const [readme, aiSummary] = await Promise.all([
    getSkillReadme(owner, name),
    analyzeSkill(skill),
  ]);

  const category = SKILL_CATEGORIES[skill.category];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{skill.displayName}</h1>
            <p className="text-lg text-muted-foreground">
              {skill.description}
            </p>
          </div>
          <Button asChild>
            <a href={skill.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              View on GitHub
            </a>
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {skill.stars != null && (
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4" /> {formatNumber(skill.stars)} stars
            </span>
          )}
          {skill.forks != null && (
            <span className="flex items-center gap-1">
              <GitFork className="h-4 w-4" /> {formatNumber(skill.forks)} forks
            </span>
          )}
          {skill.downloads != null && (
            <span className="flex items-center gap-1">
              <Download className="h-4 w-4" />{" "}
              {formatNumber(skill.downloads)} downloads/wk
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" /> Updated {timeAgo(skill.lastUpdated)}
          </span>
          {skill.license && <span>License: {skill.license}</span>}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {category && (
            <Badge variant="secondary" className={category.color}>
              {category.label}
            </Badge>
          )}
          {skill.platform.map((p) => {
            const platform = PLATFORMS[p];
            return platform ? (
              <Badge key={p} variant="outline">
                {platform.label}
              </Badge>
            ) : null;
          })}
          {skill.languages.map((lang) => (
            <Badge key={lang} variant="outline">
              {lang}
            </Badge>
          ))}
        </div>
      </div>

      {/* AI Summary */}
      {aiSummary && (
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="text-primary">AI</span> Analysis
          </h2>
          <p className="text-muted-foreground">{aiSummary.summary}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Setup Difficulty</h3>
              <SetupDifficultyBadge difficulty={aiSummary.setupDifficulty} />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Skill Level</h3>
              <Badge variant="outline">{aiSummary.skillLevel}</Badge>
            </div>
          </div>

          {aiSummary.useCases.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Use Cases</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {aiSummary.useCases.map((uc, i) => (
                  <li key={i}>{uc}</li>
                ))}
              </ul>
            </div>
          )}

          {aiSummary.setupSteps.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Quick Setup</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                {aiSummary.setupSteps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* README */}
      {readme && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">README</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none rounded-xl border p-6">
            <ReactMarkdown>{readme.slice(0, 10000)}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
