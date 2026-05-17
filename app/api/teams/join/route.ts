import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { code, userId } = body;

    const { data: team, error: teamError } =
      await supabase
        .from("teams")
        .select("*")
        .eq("code", code)
        .single();

    if (teamError || !team) {
      return NextResponse.json(
        { error: "team not found" },
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from("team_members")
      .insert({
        team_id: team.id,
        user_id: userId,
      });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      team,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}