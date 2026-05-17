import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { session_id, points } = body;

    if (!session_id || !Array.isArray(points)) {
      return NextResponse.json(
        { error: "invalid payload" },
        { status: 400 }
      );
    }

    // 1. insert logs batch
    const logs = points.map((p: any) => ({
      session_id,
      latitude: p.lat,
      longitude: p.lng,
      altitude: p.alt ?? null,
      accuracy: p.accuracy ?? null,
      tracked_at: new Date(p.time).toISOString(),
    }));

    const { error: insertError } = await supabase
      .from("tracking_logs")
      .insert(logs);

    if (insertError) throw insertError;

    // 2. update session last position
    const last = points[points.length - 1];

    const { error: updateError } = await supabase
      .from("tracking_sessions")
      .update({
        last_latitude: last.lat,
        last_longitude: last.lng,
        last_tracked_at: new Date(last.time).toISOString(),
      })
      .eq("id", session_id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, inserted: logs.length });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}