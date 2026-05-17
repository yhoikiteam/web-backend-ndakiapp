import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { session_id } = body;

    if (!session_id) {
      return NextResponse.json(
        { error: "session_id required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("tracking_sessions")
      .update({
        heartbeat_at: new Date().toISOString(),
        status: "active",
      })
      .eq("id", session_id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}