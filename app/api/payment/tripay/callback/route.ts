import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    reference,
    status,
    paid_at,
    payment_method,
  } = body;

  if (status === "PAID") {
    await supabase
      .from("payments")
      .update({
        status: "paid",
        paid_at,
        payment_method,
      })
      .eq("reference", reference);
  }

  return NextResponse.json({ success: true });
}