import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
import { env } from "@/src/config/env";

export async function GET() {
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${env.NEXT_PUBLIC_SUPABASE_URL}/auth/callback`,
    },
  });

  return NextResponse.json({ url: data.url });
}