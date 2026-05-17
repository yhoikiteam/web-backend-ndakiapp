import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
import { fetchWeather } from "@/src/lib/weather";
import { geminiModel } from "@/src/lib/gemini";

/**
 * 1. FAST RULE ENGINE (SAFETY FIRST)
 */
function ruleAnalyze(mountainWeather: any, userWeather: any) {
  let risk = "low";
  let message = "Cuaca aman untuk pendakian.";

  if (mountainWeather?.wind?.speed > 20) {
    risk = "high";
    message = "Angin kencang di gunung, risiko tinggi.";
  }

  if (mountainWeather?.main?.temp < 5) {
    risk = "medium";
    message = "Suhu sangat dingin di puncak.";
  }

  if (mountainWeather?.weather?.[0]?.main === "Rain") {
    risk = "medium";
    message = "Hujan di area gunung, jalur licin.";
  }

  return { risk, message };
}

/**
 * 2. AI ANALYSIS (Gemini)
 */
async function aiAnalyze(input: any) {
  const prompt = `
You are NDAKI AI Hiking Safety System.

Analyze weather + hiking safety.

Return JSON only:

{
  "risk_level": "low | medium | high",
  "message": "...",
  "recommendation": "...",
  "reasoning": "short explanation"
}

DATA:

MOUNTAIN WEATHER:
${JSON.stringify(input.mountainWeather, null, 2)}

USER WEATHER:
${JSON.stringify(input.userWeather, null, 2)}

RULE RESULT:
${JSON.stringify(input.ruleResult, null, 2)}
`;

  const result = await geminiModel.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(text);
  } catch {
    return {
      risk_level: "unknown",
      message: text,
      recommendation: "Cek kondisi manual",
    };
  }
}

/**
 * MAIN API
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mountain_id, user_lat, user_lng } = body;

    if (!mountain_id) {
      return NextResponse.json(
        { success: false, message: "mountain_id required" },
        { status: 400 }
      );
    }

    // 1. GET MOUNTAIN
    const { data: mountain } = await supabase
      .from("mountains")
      .select("*")
      .eq("id", mountain_id)
      .single();

    if (!mountain) {
      return NextResponse.json(
        { success: false, message: "Mountain not found" },
        { status: 404 }
      );
    }

    // 2. FETCH WEATHER PARALLEL (OPTIMIZED)
    const [mountainWeather, userWeather] = await Promise.all([
      fetchWeather(mountain.latitude, mountain.longitude),
      user_lat && user_lng
        ? fetchWeather(user_lat, user_lng)
        : null,
    ]);

    // 3. RULE ENGINE (FAST SAFETY)
    const ruleResult = ruleAnalyze(mountainWeather, userWeather);

    // 4. AI ENGINE (Gemini CONTEXT REASONING)
    const aiResult = await aiAnalyze({
      mountainWeather,
      userWeather,
      ruleResult,
      mountain,
    });

    // 5. FINAL MERGE (PRIORITIZE SAFETY)
    return NextResponse.json({
      success: true,

      mountain: {
        name: mountain.name,
        elevation: mountain.elevation,
        location: {
          lat: mountain.latitude,
          lng: mountain.longitude,
        },
      },

      weather: {
        mountain: mountainWeather,
        user: userWeather,
      },

      analysis: {
        rule_based: ruleResult,
        ai: aiResult,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}