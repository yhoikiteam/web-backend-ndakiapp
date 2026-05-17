import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const team_id = searchParams.get("team_id");

  if (!team_id) {
    return NextResponse.json(
      { error: "team_id required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("tracking_sessions")
    .select("*")
    .eq("team_id", team_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    members: data?.map((m) => ({
      user_id: m.user_id,
      lat: m.last_latitude,
      lng: m.last_longitude,
      status: m.status,
      last_seen: m.last_tracked_at,
    })),
  });
}