import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { user_id } = body;

  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user_id)
    .eq("status", "active")
    .single();

  return NextResponse.json({
    success: true,
    data,
  });
}