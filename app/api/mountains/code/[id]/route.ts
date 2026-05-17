import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function GET(
  req: NextRequest,
  context: {
    params: {
      id: string;
    };
  }
) {
  try {
    const id = context.params.id;

    const { data, error } = await supabase
      .from("mountains")
      .select(`
        id,
        code,
        name
      `)
      .eq("id", id)
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