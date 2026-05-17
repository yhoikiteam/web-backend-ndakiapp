import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
import { calculateRank } from "@/src/lib/profile-rank";

export async function GET(req: NextRequest) {
  try {
    const authHeader =
      req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const token =
      authHeader.replace("Bearer ", "");

    const { data: userData, error } =
      await supabase.auth.getUser(token);

    if (error || !userData.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 }
      );
    }

    const userId = userData.user.id;

    const { data: sessions } =
      await supabase
        .from("tracking_sessions")
        .select(`
          *,
          teams (
            mountain_name
          )
        `)
        .eq("user_id", userId)
        .eq("status", "ended");

    const totalTrip =
      sessions?.length || 0;

    let totalDistance = 0;
    let totalHours = 0;
    let totalElevation = 0;

    let longestHike = 0;
    let fastestSummit = 0;

    for (const session of sessions || []) {
      const { data: logs } =
        await supabase
          .from("tracking_logs")
          .select("*")
          .eq("session_id", session.id)
          .order("tracked_at", {
            ascending: true,
          });

      if (!logs || logs.length < 2)
        continue;

      const start = new Date(
        logs[0].tracked_at
      ).getTime();

      const end = new Date(
        logs[
          logs.length - 1
        ].tracked_at
      ).getTime();

      const durationHours =
        (end - start) /
        (1000 * 60 * 60);

      totalHours += durationHours;

      let tripDistance = 0;

      for (let i = 1; i < logs.length; i++) {
        const prev = logs[i - 1];
        const curr = logs[i];

        const dist =
          calculateDistance(
            prev.latitude,
            prev.longitude,
            curr.latitude,
            curr.longitude
          );

        tripDistance += dist;

        // elevation gain
        if (
          curr.altitude &&
          prev.altitude
        ) {
          const gain =
            curr.altitude -
            prev.altitude;

          if (gain > 0) {
            totalElevation += gain;
          }
        }
      }

      totalDistance += tripDistance;

      if (tripDistance > longestHike) {
        longestHike = tripDistance;
      }

      if (
        fastestSummit === 0 ||
        durationHours <
          fastestSummit
      ) {
        fastestSummit =
          durationHours;
      }
    }

    const avgPace =
      totalHours > 0
        ? totalDistance /
          totalHours
        : 0;

    const calories =
      Math.round(totalDistance * 65);

    const rankData =
      calculateRank(totalTrip);

    return NextResponse.json({
      success: true,

      stats: {
        total_trip: totalTrip,

        total_distance_km:
          Number(
            totalDistance.toFixed(2)
          ),

        total_trek_hours:
          Math.round(totalHours),

        total_elevation_gain:
          Math.round(totalElevation),

        avg_pace:
          Number(avgPace.toFixed(2)),

        fastest_summit_hours:
          Number(
            fastestSummit.toFixed(1)
          ),

        longest_hike_km:
          Number(
            longestHike.toFixed(2)
          ),

        estimated_calories:
          calories,

        current_rank:
          rankData.rank,

        grade:
          rankData.grade,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message,
      },
      { status: 500 }
    );
  }
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;

  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) **
      2 +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) **
      2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}