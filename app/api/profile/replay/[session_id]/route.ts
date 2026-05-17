import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      session_id: string;
    };
  }
) {
  try {
    const { session_id } = params;

    const { data, error } =
      await supabase
        .from("tracking_logs")
        .select("*")
        .eq("session_id", session_id)
        .order("tracked_at", {
          ascending: true,
        });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      route: data,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message,
      },
      { status: 500 }
    );
  }
}