import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function mapFishUnit(row: any) {
  return {
    _id: row.id,
    unitType: row.unit_type,
    unitNumber: row.unit_number,
    stockedQuantity: row.stocked_quantity,
    currentFishAlive: row.current_fish_alive,
    dateStocked: row.date_stocked,
    feedStageMM: row.feed_stage_mm,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const unitType = searchParams.get("unitType");
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("fish_units")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (unitType) {
    query = query.eq("unit_type", unitType);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching fish units:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch fish units" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    data: (data ?? []).map(mapFishUnit),
    pagination: {
      page,
      limit,
      total: count ?? 0,
      pages: Math.ceil((count ?? 0) / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const requiredFields = ["unitType", "unitNumber", "stockedQuantity", "dateStocked", "feedStageMM"];
  for (const field of requiredFields) {
    if (!body[field]) {
      return NextResponse.json(
        { success: false, error: `${field} is required` },
        { status: 400 },
      );
    }
  }

  if (!["Pond", "Cage"].includes(body.unitType)) {
    return NextResponse.json(
      { success: false, error: "unitType must be either Pond or Cage" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("fish_units")
    .insert({
      unit_type: body.unitType,
      unit_number: body.unitNumber,
      stocked_quantity: body.stockedQuantity,
      current_fish_alive: body.currentFishAlive ?? body.stockedQuantity,
      date_stocked: body.dateStocked,
      feed_stage_mm: body.feedStageMM,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating fish unit:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create fish unit" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, data: mapFishUnit(data) }, { status: 201 });
}
