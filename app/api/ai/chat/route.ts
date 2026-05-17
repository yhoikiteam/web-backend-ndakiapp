import { NextResponse } from "next/server";
import { geminiModel } from "@/src/lib/gemini";
import { buildNDAKIPrompt } from "@/src/lib/ai/prompt";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { message, team_id, location } = body;

    if (!message || !team_id) {
      return NextResponse.json(
        { error: "message & team_id required" },
        { status: 400 }
      );
    }

    // 1. GET TEAM CONTEXT
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("*")
      .eq("id", team_id)
      .single();

    if (teamError || !team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    // 2. GET LATEST TRACKING SESSION
    const { data: tracking } = await supabase
      .from("tracking_sessions")
      .select("*")
      .eq("team_id", team_id)
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // 3. WEATHER (TEMPORARY MOCK / READY FOR UPGRADE)
    const weather = {
      condition: "cloudy",
      temperature: 12,
      wind_speed: 20,
    };

    // 4. BUILD PROMPT (FIXED: userMessage)
    const prompt = buildNDAKIPrompt({
      mountain: team?.mountain_name,
      team,
      weather,
      tracking,
      userMessage: message, // ✅ FIX HERE
    });

    // 5. CALL GEMINI
    const result = await geminiModel.generateContent(prompt);
    const response = result.response.text();

    // 6. SAFE JSON PARSE
    let parsed;

    try {
      parsed = JSON.parse(response);
    } catch {
      parsed = {
        type: "info",
        message: response,
        risk_level: "medium",
        recommendation: [],
        warning: null,
      };
    }

    return NextResponse.json({
      success: true,
      data: parsed,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}