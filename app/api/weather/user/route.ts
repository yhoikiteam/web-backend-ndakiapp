import { NextRequest, NextResponse } from "next/server";
import { fetchWeather } from "@/src/lib/weather";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { lat, lng } = body;

    if (!lat || !lng) {
      return NextResponse.json(
        { success: false, message: "Missing coordinates" },
        { status: 400 }
      );
    }

    const weather = await fetchWeather(lat, lng);

    return NextResponse.json({
      success: true,
      location: { lat, lng },
      weather,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}