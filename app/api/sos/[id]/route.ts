import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      id: string;
    };
  }
) {
  try {
    const { id } = params;

    const { data, error } =
      await supabase
        .from("sos_alerts")
        .select(`
          *,
          users (
            full_name,
            avatar_url
          )
        `)
        .eq("id", id)
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