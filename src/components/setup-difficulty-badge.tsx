import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const difficultyConfig = {
  easy: {
    label: "Easy Setup",
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  },
  moderate: {
    label: "Moderate Setup",
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
  },
  complex: {
    label: "Complex Setup",
    className: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20",
  },
};

export function SetupDifficultyBadge({
  difficulty,
}: {
  difficulty: "easy" | "moderate" | "complex";
}) {
  const config = difficultyConfig[difficulty];
  return (
    <Badge variant="outline" className={cn(config.className)}>
      {config.label}
    </Badge>
  );
}
