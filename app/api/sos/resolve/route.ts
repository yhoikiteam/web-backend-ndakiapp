import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { sos_id } = body;

    const { data, error } =
      await supabase
        .from("sos_alerts")
        .update({
          status: "resolved",
          resolved_at: new Date(),
        })
        .eq("id", sos_id)
        .select()
        .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      sos: data,
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