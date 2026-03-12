import Link from "next/link";
import { Star, Download, ExternalLink, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SKILL_CATEGORIES, PLATFORMS } from "@/lib/constants";
import { formatNumber, timeAgo } from "@/lib/utils";
import type { AgentSkill } from "@/types";

export function SkillCard({ skill }: { skill: AgentSkill }) {
  const category = SKILL_CATEGORIES[skill.category];

  return (
    <Link href={`/skill/${skill.owner}/${skill.name.split("/").pop()}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base group-hover:text-primary transition-colors line-clamp-1">
              {skill.displayName}
            </CardTitle>
            <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {skill.description || "No description available"}
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {category && (
              <Badge variant="secondary" className={category.color}>
                {category.label}
              </Badge>
            )}
            {skill.platform.slice(0, 2).map((p) => {
              const platform = PLATFORMS[p];
              return platform ? (
                <Badge key={p} variant="outline" className="text-xs">
                  {platform.label}
                </Badge>
              ) : null;
            })}
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {skill.stars != null && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {formatNumber(skill.stars)}
              </span>
            )}
            {skill.downloads != null && (
              <span className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                {formatNumber(skill.downloads)}/wk
              </span>
            )}
            {skill.languages[0] && <span>{skill.languages[0]}</span>}
            <span className="flex items-center gap-1 ml-auto">
              <Clock className="h-3 w-3" />
              {timeAgo(skill.lastUpdated)}
            </span>
          </div>

          {skill.aiSummary && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-muted-foreground line-clamp-2">
                {skill.aiSummary.summary}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
