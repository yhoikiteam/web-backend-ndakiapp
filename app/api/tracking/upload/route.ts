import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      sessionId,
      logs,
    } = body;

    const formattedLogs = logs.map((log: any) => ({
      session_id: sessionId,
      latitude: log.latitude,
      longitude: log.longitude,
      altitude: log.altitude || null,
      accuracy: log.accuracy || null,
      tracked_at: log.tracked_at,
    }));

    const { error } = await supabase
      .from("tracking_logs")
      .insert(formattedLogs);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const lastLog = logs[logs.length - 1];

    await supabase
      .from("tracking_sessions")
      .update({
        last_latitude: lastLog.latitude,
        last_longitude: lastLog.longitude,
        last_tracked_at: lastLog.tracked_at,
      })
      .eq("id", sessionId);

    return NextResponse.json({
      success: true,
      inserted: formattedLogs.length,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}