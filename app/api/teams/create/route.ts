import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
import { generateTeamCode } from "@/src/lib/team-code";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      mountainId,
      leaderUserId,
      hikeStartDate,
      hikeEndDate,
      hikeType,
    } = body;

    // 1. GET MOUNTAIN
    const { data: mountain, error: mountainError } =
      await supabase
        .from("mountains")
        .select(`
          id,
          code,
          name
        `)
        .eq("id", mountainId)
        .single();

    if (mountainError || !mountain) {
      return NextResponse.json(
        { error: "mountain not found" },
        { status: 404 }
      );
    }

    // 2. GENERATE TEAM CODE
    const code = generateTeamCode(
      mountain.code
    );

    // 3. CREATE TEAM
    const { data: team, error } = await supabase
      .from("teams")
      .insert({
        code,

        name,

        mountain_id: mountain.id,
        mountain_code: mountain.code,
        mountain_name: mountain.name,

        leader_user_id: leaderUserId,

        hike_start_date: hikeStartDate,
        hike_end_date: hikeEndDate,

        hike_type: hikeType,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // 4. AUTO JOIN LEADER
    await supabase
      .from("team_members")
      .insert({
        team_id: team.id,
        user_id: leaderUserId,
        role: "leader",
      });

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