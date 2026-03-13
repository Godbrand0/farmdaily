import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function mapHarvest(row: any) {
  return {
    _id: row.id,
    fishUnitId: row.fish_unit_id,
    harvestType: row.harvest_type,
    quantityHarvested: row.quantity_harvested,
    totalWeightKg: row.total_weight_kg,
    averageWeightKg: row.average_weight_kg,
    pricePerKg: row.price_per_kg,
    totalIncome: row.total_income,
    smokedQuantity: row.smoked_quantity,
    harvestDate: row.harvest_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const fishUnitId = searchParams.get("fishUnitId");
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("fish_harvests")
    .select("*", { count: "exact" })
    .order("harvest_date", { ascending: false })
    .range(from, to);

  if (fishUnitId) {
    query = query.eq("fish_unit_id", fishUnitId);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching harvests:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch harvests" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    data: (data ?? []).map(mapHarvest),
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

  const requiredFields = [
    "fishUnitId",
    "harvestDate",
    "quantityHarvested",
    "totalWeightKg",
    "pricePerKg",
    "harvestType",
  ];
  for (const field of requiredFields) {
    if (!body[field]) {
      return NextResponse.json(
        { success: false, error: `${field} is required` },
        { status: 400 },
      );
    }
  }

  if (!["Live", "Smoked"].includes(body.harvestType)) {
    return NextResponse.json(
      { success: false, error: "harvestType must be either Live or Smoked" },
      { status: 400 },
    );
  }

  if (body.harvestType === "Smoked" && (!body.smokedQuantity || body.smokedQuantity <= 0)) {
    return NextResponse.json(
      { success: false, error: "Smoked quantity is required when harvest type is Smoked" },
      { status: 400 },
    );
  }

  // Verify fish unit exists and check stock
  const { data: fishUnit, error: unitError } = await supabase
    .from("fish_units")
    .select("id, current_fish_alive")
    .eq("id", body.fishUnitId)
    .single();

  if (unitError || !fishUnit) {
    return NextResponse.json(
      { success: false, error: "Fish unit not found" },
      { status: 404 },
    );
  }

  if (body.quantityHarvested > fishUnit.current_fish_alive) {
    return NextResponse.json(
      { success: false, error: "Quantity harvested cannot exceed current fish alive" },
      { status: 400 },
    );
  }

  const averageWeightKg = body.totalWeightKg / body.quantityHarvested;
  const totalIncome = body.totalWeightKg * body.pricePerKg;

  const { data, error } = await supabase
    .from("fish_harvests")
    .insert({
      fish_unit_id: body.fishUnitId,
      harvest_type: body.harvestType,
      quantity_harvested: body.quantityHarvested,
      total_weight_kg: body.totalWeightKg,
      average_weight_kg: averageWeightKg,
      price_per_kg: body.pricePerKg,
      total_income: totalIncome,
      smoked_quantity: body.smokedQuantity ?? 0,
      harvest_date: body.harvestDate,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating harvest record:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create harvest record" },
      { status: 500 },
    );
  }

  // Decrement current fish alive
  await supabase
    .from("fish_units")
    .update({ current_fish_alive: fishUnit.current_fish_alive - body.quantityHarvested })
    .eq("id", body.fishUnitId);

  return NextResponse.json({ success: true, data: mapHarvest(data) }, { status: 201 });
}
