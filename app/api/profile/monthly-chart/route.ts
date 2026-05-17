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

    const { data } =
      await supabase
        .from("tracking_sessions")
        .select("started_at")
        .eq("user_id", userId)
        .eq("status", "ended");

    const monthly: any = {};

    data?.forEach((item) => {
      const month =
        new Date(
          item.started_at
        ).toLocaleString("default", {
          month: "short",
        });

      monthly[month] =
        (monthly[month] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      chart: monthly,
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