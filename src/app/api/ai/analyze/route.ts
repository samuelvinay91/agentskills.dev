import { NextRequest, NextResponse } from "next/server";
import { analyzeSkill } from "@/lib/ai";
import type { AgentSkill } from "@/types";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      skill: AgentSkill;
      readme?: string;
    };

    if (!body.skill) {
      return NextResponse.json(
        { error: "Missing skill data" },
        { status: 400 }
      );
    }

    const summary = await analyzeSkill(body.skill, body.readme);

    if (!summary) {
      return NextResponse.json(
        { error: "AI analysis unavailable" },
        { status: 503 }
      );
    }

    return NextResponse.json(summary);
  } catch (error) {
    console.error("AI analyze error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
