import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("mountains")
      .select(`
        id,
        code,
        name,
        slug,
        image_url,
        elevation,
        province,
        hiking_status,
        is_active
      `)
      .eq("is_active", true)
      .order("name");

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      mountains: data,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}