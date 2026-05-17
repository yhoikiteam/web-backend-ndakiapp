import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    title,
    mountain_id,
    mountain_name,
    organizer_name,
    price_min,
    price_max,
    start_date,
    end_date,
    meeting_point,
    total_slots,
    description,
  } = body;

  const { data, error } = await supabase
    .from("open_trips")
    .insert({
      title,
      mountain_id,
      mountain_name,
      organizer_name,
      price_min,
      price_max,
      start_date,
      end_date,
      meeting_point,
      total_slots,
      available_slots: total_slots,
      description,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data,
  });
}