import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const authHeader =
      req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const token =
      authHeader.replace("Bearer ", "");

    const { data: userData, error } =
      await supabase.auth.getUser(token);

    if (error || !userData.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 }
      );
    }

    const userId = userData.user.id;

    const { data, error: historyError } =
      await supabase
        .from("tracking_sessions")
        .select(`
          *,
          teams (
            name,
            mountain_name,
            mountain_code
          )
        `)
        .eq("user_id", userId)
        .order("started_at", {
          ascending: false,
        });

    if (historyError) {
      throw historyError;
    }

    return NextResponse.json({
      success: true,
      history: data,
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