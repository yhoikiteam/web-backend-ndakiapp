import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function GET(
  req: Request,
  { params }: { params: { reference: string } }
) {
  const { data } = await supabase
    .from("payments")
    .select("*")
    .eq("reference", params.reference)
    .single();

  return NextResponse.json({
    success: true,
    data,
  });
}