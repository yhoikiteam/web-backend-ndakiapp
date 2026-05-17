import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    user_id,
    type,
    amount,
    trip_id,
    subscription_id,
  } = body;

  // generate reference
  const reference = `NDK-${Date.now()}`;

  const { data, error } = await supabase
    .from("payments")
    .insert({
      user_id,
      type,
      amount,
      trip_id,
      subscription_id,
      reference,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // TODO: call Tripay API (sandbox)

  return NextResponse.json({
    success: true,
    data,
  });
}