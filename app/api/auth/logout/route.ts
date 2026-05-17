import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function POST() {
  await supabase.auth.signOut();

  return NextResponse.json({ message: "logged out" });
}