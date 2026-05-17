import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      team_id: string;
    };
  }
) {
  try {
    const { team_id } = params;

    const { data, error } =
      await supabase
        .from("sos_alerts")
        .select("*")
        .eq("team_id", team_id)
        .eq("status", "active")
        .order("created_at", {
          ascending: false,
        });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      alerts: data,
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