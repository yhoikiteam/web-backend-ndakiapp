import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();

  const { trip_id, user_id, participants } = body;

  const { data: trip } = await supabase
    .from("open_trips")
    .select("*")
    .eq("id", trip_id)
    .single();

  if (!trip) {
    return NextResponse.json(
      { success: false, message: "Trip not found" },
      { status: 404 }
    );
  }

  if (trip.available_slots < participants) {
    return NextResponse.json(
      { success: false, message: "Slot tidak cukup" },
      { status: 400 }
    );
  }

  await supabase.from("open_trip_bookings").insert({
    trip_id,
    user_id,
    participants,
    total_price:
      participants * ((trip.price_min + trip.price_max) / 2),
  });

  await supabase
    .from("open_trips")
    .update({
      available_slots: trip.available_slots - participants,
    })
    .eq("id", trip_id);

  return NextResponse.json({
    success: true,
    message: "Booking successful",
  });
}