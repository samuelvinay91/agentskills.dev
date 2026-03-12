"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { SKILL_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function CategoryChips() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("cat");

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {Object.entries(SKILL_CATEGORIES).map(([key, cat]) => {
        const isActive = activeCategory === key;
        return (
          <Link key={key} href={`/search?cat=${key}`}>
            <Badge
              variant={isActive ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-colors hover:bg-accent",
                isActive && cat.color
              )}
            >
              {cat.label}
            </Badge>
          </Link>
        );
      })}
    </div>
  );
}
