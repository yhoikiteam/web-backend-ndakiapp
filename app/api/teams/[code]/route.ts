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

    const { data: team, error } = await supabase
      .from("teams")
      .select("*")
      .eq("code", code)
      .single();

    if (error || !team) {
      return NextResponse.json(
        { error: "team not found" },
        { status: 404 }
      );
    }

    const { data: members } = await supabase
      .from("team_members")
      .select(`
        *,
        personal_gear(*)
      `)
      .eq("team_id", team.id);

    const { data: teamGear } = await supabase
      .from("team_gear")
      .select("*")
      .eq("team_id", team.id);

    return NextResponse.json({
      success: true,
      team,
      members,
      teamGear,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}