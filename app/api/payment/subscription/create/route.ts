import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();

  const { user_id, plan, price } = body;

  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + (plan === "monthly" ? 1 : 12));

  const { data, error } = await supabase
    .from("subscriptions")
    .insert({
      user_id,
      plan,
      price,
      end_date: endDate.toISOString(),
    })
    .select()
    .single();

  return NextResponse.json({
    success: true,
    data,
  });
}