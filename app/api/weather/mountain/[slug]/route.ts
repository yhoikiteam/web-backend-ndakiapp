import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
import { fetchWeather } from "@/src/lib/weather";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const { data: mountain, error } = await supabase
      .from("mountains")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !mountain) {
      return NextResponse.json(
        { success: false, message: "Mountain not found" },
        { status: 404 }
      );
    }

    const weather = await fetchWeather(
      mountain.latitude,
      mountain.longitude
    );

    return NextResponse.json({
      success: true,
      mountain: {
        name: mountain.name,
        elevation: mountain.elevation,
      },
      weather,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}