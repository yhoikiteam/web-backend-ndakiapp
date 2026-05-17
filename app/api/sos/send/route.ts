import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function POST(req: NextRequest) {
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

    const body = await req.json();

    const {
      session_id,
      latitude,
      longitude,
      altitude,
      message,
    } = body;

    // ambil session
    const { data: session } =
      await supabase
        .from("tracking_sessions")
        .select("*")
        .eq("id", session_id)
        .single();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Session not found",
        },
        { status: 404 }
      );
    }

    const { data, error: insertError } =
      await supabase
        .from("sos_alerts")
        .insert({
          session_id,

          user_id:
            userData.user.id,

          team_id:
            session.team_id,

          latitude,
          longitude,
          altitude,

          message,
        })
        .select()
        .single();

    if (insertError) {
      throw insertError;
    }

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