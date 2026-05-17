import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function GET(
  req: NextRequest,
  context: {
    params: {
      slug: string;
    };
  }
) {
  try {
    const slug = context.params.slug;

    const { data, error } = await supabase
      .from("mountains")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "mountain not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      mountain: data,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}