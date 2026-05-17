import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function GET(
  req: NextRequest,
  context: {
    params: {
      code: string;
    };
  }
) {
  try {
    const code = context.params.code;

    const { data: team } = await supabase
      .from("teams")
      .select("*")
      .eq("code", code)
      .single();

    if (!team) {
      return NextResponse.json(
        { error: "team not found" },
        { status: 404 }
      );
    }

    const { data: sessions } = await supabase
      .from("tracking_sessions")
      .select("*")
      .eq("team_id", team.id)
      .eq("status", "active");

    return NextResponse.json({
      success: true,
      team,
      activeTracking: sessions,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}