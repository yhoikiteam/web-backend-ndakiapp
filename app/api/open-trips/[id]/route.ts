import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { data: trip } = await supabase
    .from("open_trips")
    .select("*")
    .eq("id", params.id)
    .single();

  const { data: benefits } = await supabase
    .from("open_trip_benefits")
    .select("*")
    .eq("trip_id", params.id);

  if (!trip) {
    return NextResponse.json(
      { success: false, message: "Trip not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      ...trip,
      benefits,
    },
  });
}