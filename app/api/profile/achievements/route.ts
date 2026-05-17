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

    const { data: userData } =
      await supabase.auth.getUser(token);

    const userId =
      userData.user?.id;

    const { data, error } =
      await supabase
        .from("user_achievements")
        .select("*")
        .eq("user_id", userId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      achievements: data,
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